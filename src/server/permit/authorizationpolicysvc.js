const axios = require('axios');
const https = require('https');
const logger = require('../logger');
const constants = require('./const');

class AuthorizationPolicySvc {
  constructor(obj) {
    if (!obj.appid) {
      throw new Error('[FATAL] AuthorizationPolicySvc: PermIT Application ID is required');
    }
    if (!obj.env) {
      throw new Error(`[FATAL] AuthorizationPolicySvc: target PermIT environment must be one of ${Object.keys(constants.permitEndpoints)}`);
    }

    const axiosConfig = {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // enable self-signed certificates; required for SSO
      }),
    };
    if (!obj.token) {
      if (!obj.username) {
        throw new Error('[FATAL] AuthorizationPolicySvc: SOA Consumer ID required');
      }
      if (!obj.password) {
        throw new Error('[FATAL] AuthorizationPolicySvc: SOA Consumer password required');
      }
      axiosConfig.auth = {
        // Basic Auth credentials
        username: obj.username,
        password: obj.password,
      };
    } else {
      axiosConfig.headers = { Authorization: obj.token };
    }
    this.http = axios.create(axiosConfig);
    this.url = constants.permitEndpoints[obj.env];
    this.appid = obj.appid;
  }

  async getUserRoles(userid) {
    const query = `${this.url}/user/${userid}?appid=${this.appid}`;
    return this.http
      .get(query)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(err => {
        logger.info(err);
        return Promise.resolve([]);
      });
  }

  async getPolicies() {
    const query = `${this.url}/policy/${this.appid}`;
    return this.http
      .get(query)
      .then(response => {
        const policies = response.data;
        const allowPolicies = [];
        const denyPolicies = [];
        for (let i = 0; i < policies.length; i += 1) {
          const policy = policies[i];
          if (policy.effect === 'Allow') allowPolicies.push(policy);
          else denyPolicies.push(policy);
        }
        return Promise.resolve({ deny: denyPolicies, allow: allowPolicies });
      })
      .catch(err => {
        logger.info(err);
        return Promise.resolve({ allow: [], deny: [] });
      });
  }

  async getRoles() {
    const query = `${this.url}/role/${this.appid}`;
    return this.http
      .get(query)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(err => {
        logger.info(err);
        return Promise.resolve([]);
      });
  }
}
module.exports = AuthorizationPolicySvc;
