const permitEndpoints = {
  dv: 'https://soa-mp-toll-dv02.tsl.telus.com/v1/eo/securitymgmt/authorizationpolicy',
  at: 'https://soa-mp-toll-at01.tsl.telus.com/v1/eo/securitymgmt/authorizationpolicy',
  pt: 'https://soa-mp-toll-pt02.tsl.telus.com/v1/eo/securitymgmt/authorizationpolicy',
  st: 'https://soa-mp-toll-st01.tsl.telus.com/v1/eo/securitymgmt/authorizationpolicy',
  pr: 'https://soa-mp-toll-pr.tsl.telus.com/v1/eo/securitymgmt/authorizationpolicy',
};
const cacheTimeoutDefault = 60000; // 1 minute

module.exports = { permitEndpoints, cacheTimeoutDefault };
