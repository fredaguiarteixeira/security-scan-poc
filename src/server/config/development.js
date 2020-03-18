module.exports = {
  env: 'development',
  port: 8080, // port 8080 is required in order to borrow an existing callback url that has already been configured in PingFed.
  sso: {
    enabled: true,
    env: 'pt168',
    callback: 'http://localhost:8080/RAPiD3/login/callback',
    issuer: 'http://localhost:8080/RAPiD3',
  },
  permit: {
    env: 'dv',
    appid: 'nodejs_poc',
    token: 'Basic QVBQX09yZGVyUG9ydGFsOnNvYW9yZ2lk',
  },
  sessionSecret: 'secret', // this value is used to encrypt the session; in non-prod environments you will want this to be less obvious,
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
