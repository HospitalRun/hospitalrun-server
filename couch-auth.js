var config =  require('./config.js');
var nano = require('nano')(config.couchAuthDbURL);
var serializer = require('serializer');
var users = nano.use('_users');

function createOAuthTokens(secretBase, user, callback) {
  var consumerKey = serializer.randomString(96);
  var tokenKey = serializer.randomString(96);
  user.oauth = {
    consumer_keys: {},
    tokens: {},
  };
  user.oauth.consumer_keys[consumerKey] = createSecret(secretBase);
  user.oauth.tokens[tokenKey] = createSecret(secretBase);
  users.insert(user, user._id, function(err, response) {
    if (err || !response.ok) {
      console.log('ERROR Updating user with credentials:');
      console.dir(response);
      callback(response);
    } else {
      callback(null, denormalizeOAuth(user));
    }
  });
}

function createSecret(secretBase) {
  var encryptKey = serializer.randomString(48);
  var validateKey = serializer.randomString(48);
  var secretString = serializer.secureStringify(secretBase, encryptKey, validateKey);
  if (secretString.length > 80) {
    secretString = secretString.substr(30,50);
  }
  return secretString;
}

function denormalizeOAuth(user) {
  var key;
  for (key in user.oauth.consumer_keys) {
    user.consumer_key = key;
    user.consumer_secret = user.oauth.consumer_keys[key];
    break;
  }
  for (key in user.oauth.tokens) {
    user.token_key = key;
    user.token_secret = user.oauth.tokens[key];
    break;
  }
  return user;
}

function validateOAuth(oauth) {
  try {
    if (Object.keys(oauth.consumer_keys).length > 0 && Object.keys(oauth.tokens).length > 0) {
      return true;
    }
  } catch (ex) {
    //Oauth is bad, just let the false return;
  }
  return false;
}

module.exports = {
  findOAuthUser: function(accessToken, refreshToken, profile, callback) {
    var userKey = 'org.couchdb.user:' + profile.emails[0].value;
    users.get(userKey, {}, function(err, body) {
      if (err) {
        if (err.status_code === 404) {
          callback();
        } else {
          callback(err);
        }
        return;
      }
      if (validateOAuth(body.oauth)) {
        return callback(null, denormalizeOAuth(body));
      } else {
        createOAuthTokens(accessToken, body, callback);
      }
    });
  },

  findUser: function(userName, callback) {
    var userKey = userName;
    if (userKey.indexOf('org.couchdb.user:') !== 0) {
      userKey = 'org.couchdb.user:' + userKey;
    }
    users.get(userKey, {}, function(err, body) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, body);
    });
  },

  getPrimaryRole: function(user) {
    var primaryRole = '';
    if (user.roles) {
      user.roles.forEach(function(role) {
        if (role !== 'user' && role !== 'admin') {
          primaryRole = role;
        }
      });
    }
    return primaryRole;
  },

};
