// Load environment specific configuration file
const env = process.env.NODE_ENV || 'development';
const config = require(`./${env}`); // eslint-disable-line import/no-dynamic-require
// Set environment variables
process.env.NODE_ENV = config.env;
module.exports = config;
