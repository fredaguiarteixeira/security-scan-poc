const express = require('express');
const morgan = require('morgan');
// const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
// const jwt = require('jsonwebtoken');
const TELUSAuth = require('./auth');
const config = require('./config');

const enabledSSO = false;
const development = process.env.NODE_ENV === 'development';
const DIST = path.resolve(__dirname, '../');

const server = express();

server.get('/version', (req, res) => {
  res.json({ version: '1.0' });
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

if (enabledSSO && !development) {
  TELUSAuth.authSetup(server, config.sessionSecret, config.sso, config.permit);
}

// openssl genrsa -out jwt-private.pem 2048
// openssl rsa -in jwt-private.pem -pubout > jwt-public.pem
// const jwtPrivateKey = fs.readFileSync(path.resolve(__dirname, './jwt-private.pem'), 'utf8');
server.get('/', (req, res) => {
  // const token = jwt.sign({ tid: 't828913' }, jwtPrivateKey, { algorithm: 'RS256' });
  // res.cookie('jwt', token);
  res.sendFile(`${DIST}/index.html`);
});

if (enabledSSO && !development) {
  server.get('/authorized', (req, res) => {
    TELUSAuth.isAuthorized(req.user, 'resource', 'action').then(authorized => {
      if (authorized) {
        // do whatever stuff the user is authorized to do here
        res.status(200).send('Authorized');
      } else {
        res.status(401).send('Unauthorized');
      }
    });
  });
}

// general error handler
server.use((err, req, res, next) => {
  console.log(`[FATAL] ${JSON.stringify(err)}`);
  next(err);
});
server.use(helmet());

// Setup logger
server.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
server.use(express.static(DIST));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
