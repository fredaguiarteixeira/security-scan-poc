module.exports = {
  env: 'staging',
  port: 8080, // port 8080 is required in order to borrow an existing callback url that has already been configured in PingFed.
  sso: {
    enabled: true,
    env: 'pt148',
    callback: 'https://portalstartertemplateui-staging-ui-portals.paas-app-west-np.tsl.telus.com/RAPiD3/login/callback',
    issuer: 'https://portalstartertemplateui-staging-ui-portals.paas-app-west-np.tsl.telus.com/RAPiD3',
  },
  permit: {
    env: 'dv',
    appid: 'nodejs_poc',
    token: 'Basic QVBQX09yZGVyUG9ydGFsOnNvYW9yZ2lk',
  },
  sessionSecret: 'secret', // this value is used to encrypt the session; in non-prod environments you will want this to be less obvious
  logging: {
    prettyPrint: true,
    level: 'debug',
    stringify: false,
    humanReadableUnhandledException: true,
    json: true,
    colorize: true,
    timestamp: true,
  },
};
