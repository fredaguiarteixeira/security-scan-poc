const passport = require('passport');
const saml = require('passport-saml');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { URL } = require('url');
const logger = require('../logger');
const PermIT = require('../permit');
const constants = require('./const');

const settings = {};
const permit = new PermIT();
/**
 * TELUS Authentication setup will initialize permit, intialize passport authentication to the TELUS IDP, and will configure express with
 * cookie-parser, body-parser, and express-session. Express route handlers will be setup to /login, /login/fail, and /callback to automatically
 * handle authentication (unless you set ssoSettings.routes).
 * @param {*} express pointer to your express object
 * @param {*} secret secret string used to encrypt the session cookie
 * @param {*} ssoSettings
 *            - env: target sso environment, matching with their environment naming convention
 *            - callback: your applications callback url for the IDP to use
 *            - issuer: your applications name as registered with the IDP, typically your site root
 *            - homePath: the homepage for your application, default is /
 *            - loginPath: the login page for your application, default is /login
 *            - failPath: the authentication failure page for your application, default is /login/fail
 *            - routes: if false, will disable the route handler setup for logging in
 * @param {*} permitSettings
 *            - env: target PermIT environment, matching with their environment naming convention
 *            - appid: the application id for your app as configured in PermIT
 *            - token: the SOA basic auth token to be used by your app to consume the PermIT REST service,
 *              not required if username/password have been specified
 *            - username: the SOA basic auth username to be used by your app to consume the PermIT REST service,
 *              not required if token has been specified
 *            - password: the SOA basic auth password to be used by your app to consume the PermIT REST service,
 *              not required if token has been specified
 */
function authSetup(express, secret, ssoSettings, permitSettings) {
  if (!express) {
    throw new Error('[FATAL] authSetup: express pointer required for authorization setup');
  }
  if (!secret) {
    throw new Error('[FATAL] authSetup: your users sessions will not be secure without a secret to encrypt them; can be any string');
  }
  if (!ssoSettings.env) {
    throw new Error(`[FATAL] authSetup: target Pingfed environment must be one of ${Object.keys(constants.ssoEndpoints)}`);
  }
  if (!ssoSettings.callback) {
    throw new Error('[FATAL] authSetup: Pingfed application callback url (as configured on our SSO IDP) must be specified');
  }
  if (!ssoSettings.issuer) {
    throw new Error('[FATAL] authSetup: Pingfed issuer (as configured on our SSO IDP) must be specified; typically your site root');
  }
  settings.callback = ssoSettings.callback;
  const url = new URL(settings.callback);
  const issuer = ssoSettings.issuer ? ssoSettings.issuer : url.host; // use site root if no issuer is provided
  settings.homePath = ssoSettings.homePath ? ssoSettings.homePath : constants.homePathDefault;
  settings.loginPath = ssoSettings.loginPath ? ssoSettings.loginPath : constants.loginPathDefault;
  settings.failPath = ssoSettings.failPath ? ssoSettings.failPath : constants.failPathDefault;
  settings.logoutPath = ssoSettings.logoutPath ? ssoSettings.logoutPath : constants.logoutPathDefault;
  permit.settings(permitSettings);
  // Passport setup
  passport.serializeUser(function fn(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function fn(user, done) {
    done(null, user);
  });
  const samlStrategy = new saml.Strategy(
    {
      callbackUrl: settings.callback, // Service Provider URL, called by Identity Provider after authentication
      entryPoint: constants.ssoEndpoints[ssoSettings.env], // Identity Provider's URL, called by app to trigger authentication
      issuer, // typically site root, but whatever is registered with the Identity Provider
      disableRequestedAuthnContext: true,
      forceAuthn: false,
      authnRequestBinding: 'HTTP-POST',
      identifierFormat: null,
      // decryptionPvk: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'), // Service Provider Private Key
      // privateCert: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'), // Service Provider Certificate
      cert: fs.readFileSync(`${__dirname}/sso_${ssoSettings.env}.pem`, 'utf8'), // Identity Provider's Public Key
    },
    function ver(profile, done) {
      return done(null, profile);
    }
  );
  passport.use(samlStrategy);
  // Express setup
  express.use(cookieParser());
  express.use(bodyParser.json());
  express.use(bodyParser.urlencoded({ extended: true }));
  express.use(
    session({
      resave: true,
      saveUninitialized: true,
      secret,
    })
  );
  express.use(passport.initialize());
  express.use(passport.session());
  if (ssoSettings.routes !== false) {
    // unless user explicitly says not to, set up routes
    setupAuthRoutes(express);
  }
}
/**
 * Configures express route handlers for the login page, the IDP callback, and the login failure page.
 * Also sets up authentication middleware (ensureAuthenticated) for every get request.
 * @param {*} express pointer to your express object
 */
function setupAuthRoutes(express) {
  if (!settings) {
    throw new Error('[FATAL] setupAuthRoutes: pingfedSetup must be performed first');
  }
  const callback = new URL(settings.callback);
  express.get(
    settings.loginPath, // when the user accesses the app/login, use passport to authenticate
    passport.authenticate('saml', { failureRedirect: settings.failPath }),
    function fn(req, res) {
      res.redirect(settings.homePath);
    }
  );
  express.get(settings.logoutPath, (req, res) => {
    req.logout();
    res.clearCookie('connect.sid'); // clear the session cookie
    // TODO: log out of PingFed SSO as well...
    res.send('Logged out'); // TODO: should make a telus style logout page for this
  });
  express.post(
    callback.pathname, // listens for idp to call upon completion of authentication
    passport.authenticate('saml', { failureRedirect: settings.failPath }),
    function fn(req, res) {
      logger.info(`[INFO] Pingfed: ${req.user.nameID} logged in`);
      res.redirect(settings.homePath);
    }
  );
  express.get(settings.failPath, function fn(req, res) {
    res.status(401).send('Login failed'); // TODO: should create a telus style failure page for this
  });
  // force authentication for every page (except above 3 due to infinite looping, so must come after)
  express.all('*', ensureAuthenticated);
  express.get(
    '/permit/:resource/:action',
    reqAuthorized, // allows client browser to query for user auth
    function fn(req, res) {
      if (res.locals.isAuthorized) {
        res.send(true);
      } else {
        res.status(401).send(false); // 401: unauthorized
      }
    }
  );
}

/**
 * Middleware that confirms the user is authenticated. If not, the user is automatically redirected to the login page.
 * This is automatically registered for all get requests during authSetup setupAuthRoutes.
 * @param {*} req uses req.isAuthenticated(), and populates req.session.permit (using req.user) if not already populated.
 * @param {*} res automatically redirect if the user is not already authenticated.
 * @param {*} next next function to be executed (if authenticated).
 */
async function ensureAuthenticated(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      logger.info(`[INFO] Pingfed: ${req.user.nameID} is authenticated`);
      return next();
    }
    return res.redirect(settings.loginPath);
  } catch (err) {
    logger.info(err);
    return res.redirect(settings.loginPath);
  }
}
/**
 * Middleware that confirms the user is authenticated and that the user is authorized to perform the requested action on the resource.
 * Purely server-side, does not rely on information from cookie.
 * @param {*} req must contain req.user or req.session.permit, as well as req.params. resource and
 * req.params.action, or req.query.resource and req.query.action.
 * @param {*} res res.locals.isAuthorized stores true/false result for reference in next function.
 * @param {*} next next function to be executed.
 */
async function reqAuthorized(req, res, next) {
  try {
    const resource = req.params.resource ? req.params.resource : req.query.resource;
    const action = req.params.action ? req.params.action : req.query.action;
    const auth = await permit.isAuthorized(req.user, resource, action);
    if (auth === true) {
      res.locals.isAuthorized = true;
      return next();
    }
    res.locals.isAuthorized = false;
    return next();
  } catch (err) {
    logger.info(err);
    res.locals.isAuthorized = false;
    return next();
  }
}

// just a wrapper to expose the permit function for use
async function isAuthorized(ssoIdentity, resource, action) {
  return permit.isAuthorized(ssoIdentity, resource, action);
}

module.exports = { authSetup, setupAuthRoutes, ensureAuthenticated, reqAuthorized, isAuthorized };
