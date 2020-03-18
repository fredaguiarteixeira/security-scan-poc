const localCache = require('memory-cache');
const logger = require('../logger');
const AuthorizationPolicySvc = require('./authorizationpolicysvc');
const constants = require('./const');

const regexUID = /[TXtx]?(\d{6})/;
/**
 * Manages connection to permit service and server-side cache of application policies.
 * One instance of this per application.
 */
class PermIT {
  /**
   * Create a server-side permit authorization manager.
   * @param {*} obj {
   *  env: target permit environment
   * 	appid: your permit application id
   *  cacheTimeout: (optional) timeout period for the data cache
   *  token: authentication token for consuming the PermIT REST service, not required if username/password is provided instead
   *  username: SOA username for consuming the PermIT REST service, not required if token is provided instead
   *  password: SOA password for consuming the PermIT REST service, not required if token is provided instead
   */
  constructor(obj) {
    if (!obj) {
      this.permitSvc = null;
      this.timeout = constants.cacheTimeoutDefault;
    } else {
      this.permitSvc = new AuthorizationPolicySvc(obj);
      this.timeout = obj.cacheTimeout ? obj.cacheTimeout : constants.cacheTimeoutDefault;
    }
  }

  settings(obj) {
    this.permitSvc = new AuthorizationPolicySvc(obj);
    this.timeout = obj.cacheTimeout ? obj.cacheTimeout : constants.cacheTimeoutDefault;
  }

  getPolicies() {
    try {
      const existing = localCache.get('policies');
      if (!existing) {
        // get policies from service
        return this.permitSvc
          .getPolicies()
          .then(result => {
            localCache.put('policies', result, this.timeout); // cache the policies
            return Promise.resolve(result);
          })
          .catch(err => {
            logger.info(err);
            return Promise.resolve(null);
          });
      } // use cached policies
      return Promise.resolve(existing);
    } catch (err) {
      return Promise.resolve(null);
    }
  }

  getRoles() {
    try {
      const existing = localCache.get('roles');
      if (!existing) {
        // get roles from service
        return this.permitSvc
          .getRoles()
          .then(result => {
            localCache.put('roles', result, this.timeout); // cache the roles
            return Promise.resolve(result);
          })
          .catch(err => {
            logger.info(err);
            return Promise.resolve(null);
          });
      } // get cached roles
      return Promise.resolve(existing);
    } catch (err) {
      return Promise.resolve(null);
    }
  }

  getUserRoles(userid) {
    try {
      const existing = localCache.get(userid);
      if (!existing) {
        // get user roles from service
        return this.permitSvc
          .getUserRoles(userid)
          .then(result => {
            localCache.put(userid, result, this.timeout); // cache the roles using the userid as the key
            return Promise.resolve(result);
          })
          .catch(err => {
            logger.info(err);
            return Promise.resolve(null);
          });
      } // get cached user roles
      return Promise.resolve(existing);
    } catch (err) {
      return Promise.resolve(null);
    }
  }

  /**
   * Check if the logged in user is authorized to access the resource and action, given the custom attributes.
   * This is not fully secure if run on the client;
   * @param resource
   * @param action
   * @param attributes - custom attributes used to evaluate policy expression
   * @return true if user is allowed to access the specified resource and action, false otherwise
   */
  async isAuthorized(ssoIdentity, resource, action) {
    const userid = ssoIdentity.nameID.match(regexUID)[1]; // get only numeric part of id for query
    const userRoles = await this.getUserRoles(userid);
    const policies = await this.getPolicies();
    try {
      // go through deny policy list, if deny, return false, and don't look at allow list
      for (let i = 0; i < policies.policy.length; i += 1) {
        const policy = policies.policy[i];
        if (this.match(policy, resource, action, userRoles)) {
          logger.info(`[INFO] PermIT: ${userid} is not authorized to ${action} on ${resource}`);
          return false; // deny if there is a match in the deny policies
        }
      }

      for (let i = 0; i < policies.allow.length; i += 1) {
        const policy = policies.allow[i];
        if (this.match(policy, resource, action, userRoles)) {
          logger.info(`[INFO] PermIT: ${userid} has been authorized to ${action} on ${resource}`);
          return true; // allow if there is a match in the allow policies
        }
      }

      logger.info(`[INFO] PermIT: ${userid} is not authorized to ${action} on ${resource}`);
      return false; // deny if policy not found
    } catch (err) {
      logger.info(err);
      logger.info(`[INFO] PermIT: ${userid} is not authorized to ${action} on ${resource}`);
      return false; // deny if there are any errors
    }
  }

  /**
   * Does this policy apply to the targetted resource?
   * @param {string} policyResource
   * @param {string} resource
   */
  static matchResource(policyResource, resource) {
    if (!policyResource) {
      return true; // there are no resources in this policy meaning any resource is allowed, so this policy applies
    }
    if (policyResource === resource) {
      return true; // this policy applies to the targetted resource
    }
    return false; // this policy does not apply to the targetted resource
  }

  /**
   * Does this policy apply to the targetted action?
   * @param {string[]} policyActionList
   * @param {string} action
   */
  static matchAction(policyActionList, action) {
    if (!policyActionList) {
      return true; // there are no actions in this policy meaning any action is allowed, so this policy applies
    }
    if (!action) {
      return true; // no action is being targetted, so this policy applies
    }
    if (policyActionList.indexOf(action) !== -1) {
      return true; // this policy applies to the targetted action
    }
    return false; // this policy does not apply to the targetted action
  }

  /**
   *
   * @param policyRoles - roles defined in the policy
   * @param userRoles - roles the user has
   * @return true if 1) policy does not contain any roles, or 2) policyRoles contains any roles in userRoles;
   *  return false if policy contains a role but user does not have that role
   */
  static matchRoles(policyRoles, userRoles) {
    if (!policyRoles) {
      return true; // there are no roles in this policy meaning any role is allowed, so this policy applies
    }
    if (!userRoles) {
      return false; // there are roles in this policy, and this user does not have any roles, so they are not authorized
    }
    for (let i = 0; i < policyRoles.length; i += 1) {
      const policy = policyRoles[i];
      for (let k = 0; k < userRoles.length; k += 1) {
        const user = userRoles[k];
        if (policy === user) {
          return true; // this user has the role required for this policy, so this policy applies
        }
      }
    }
    return false; // this user does not have one of the roles required for this policy, so they are not authorized
  }

  match(policy, resource, action, roles) {
    if (this.matchResource(policy.resourceId, resource)) {
      if (this.matchAction(policy.actionList, action)) {
        if (this.matchRoles(policy.roleList, roles)) {
          return true;
        }
      }
    }
    return false;
  }
}
module.exports = PermIT;
