const request     = require('request');
const config      = require('../../config.js');
const permissions = require('./permissions.js');

const hasDefaultPermision = (role, path) => {
  // Check default perms. If this route has no whitelist, then all roles are allowed
  if (!permissions || !permissions[path] || permissions[path].length === 0) {
    return true;
  }
  if (permissions[path].indexOf(role) !== -1) {
    return true;
  }
  return false;
}

const hasRoutePermission = (reqOpt, role, path) => {
  // NOTE: resolve and reject here are "flipped" to make more sense in the body.
  // In checkUserRoutePermissions we use the immediate error callback of Promise.all
  // to "short cicuit" the valid authorization
  return new Promise((reject, resolve) => {
    reqOpt.url = `${config.couchDbURL}/main/userRole_2_${role.toLowerCase().replace(' ', '-')}`;
    request(reqOpt, (error, res, body) => {
      if (error) {
        return reject(error);
      }

      body = body && JSON.parse(body);
      if (body.error === 'not_found') {
        // No custom auth, use default
        if (hasDefaultPermision(role, path)) {
          return resolve(role);
        }
        return reject(role);
      } else if (body && body.data && body.data.capabilities) {
        // Check db permissions
        if (body.data.capabilities.indexOf(role) !== -1) {
          return resolve(role);
        }
        return reject();
      }

      return reject({ error, body })
    });
  });
}

const checkUserRoutePermissions = (requestOptions, userRoles, route) => {
  return new Promise((resolve, reject) => {
    // Flipped the .then and .catch, since we want to "short circuit" when the user is authenticated.
    if (userRoles.length === 1) {
      hasRoutePermission(requestOptions, userRoles[0], route)
      .then(error => reject(error))
      .catch(role => resolve(role));
    } else {
      Promise.all(userRoles.map(role => hasRoutePermission(requestOptions, role, route)))
      .then(error => reject(error))
      .catch(role => resolve(role));
    }
  });
}

const checkRole = (req, path) => {
  return new Promise((resolve, reject) => {
    const reqOpt = getOAuthOpt(req) || {};
    reqOpt.url = `${config.couchDbURL}/_session`;
    request(reqOpt, (error, res, body) => {
      if (error) {
        return reject(error);
      }
      const session = JSON.parse(body);
      if (session.error) {
        return reject(session.reason);
      } else if (session.userCtx.name === null) {
        return reject('Unknown user');
      } else {
        const userRoles = session.userCtx.roles.filter(r => ['user', 'admin'].indexOf(r) === -1);
        if (session.userCtx.roles.indexOf('_admin') !== -1) {
          return resolve('_admin');
        }
        checkUserRoutePermissions(reqOpt, userRoles, path)
        .then(role => resolve(role))
        .catch(reason => reject(reason))
      }
    });
  });
}

const getOAuthOpt = req => {
  if (req.get('x-oauth-consumer-key')) {
    const opt = {};
    opt.oauth = {
      consumer_key    : req.get('x-oauth-consumer-key'),
      consumer_secret : req.get('x-oauth-consumer-secret'),
      token           : req.get('x-oauth-token'),
      token_secret    : req.get('x-oauth-token-secret')
    };
    return opt;
  }
  return null;
}

const authHandler = (scheme, name) => {
  return {
    handler: (options, path) => {
      return (req, res, next) => {
        checkRole(req, path).then(role => {
          next();
        }).catch(error => {
          if (process.env.NODE_ENV !== 'production') {
            return res.status(403).json({ message: 'Unauthorized', status: 403, error });
          } else {
            return res.status(403).json({ message: 'Unauthorized', status: 403 });
          }
        });
      };
    }
  };
}

module.exports = {
  oauth_1_0: authHandler
};
