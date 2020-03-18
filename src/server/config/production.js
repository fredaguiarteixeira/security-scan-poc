module.exports = {
  env: 'production',
  port: 8080,
  sso: {
    enabled: true,
    env: 'pr',
    callback: '...',
    issuer: '...',
  },
  permit: {
    env: 'pr',
    appid: '...',
    token: '...',
  },
  sessionSecret: '...',
  logging: {
    prettyPrint: false,
    level: 'info',
    stringify: false,
    humanReadableUnhandledException: false,
    json: true,
    colorize: false,
    timestamp: true,
  },
};
