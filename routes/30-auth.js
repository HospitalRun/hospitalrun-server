var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bodyParser = require('body-parser');
var express = require('express');
var expressSession = require('express-session');
var passport = require('passport');
var serializer = require('serializer');

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
    // Oauth is bad, just let the false return;
  }
  return false;
}



function getPrimaryRole(user) {
  var primaryRole = '';
  if (user.roles) {
    user.roles.forEach(function(role) {
      if (role !== 'user' && role !== 'admin') {
        primaryRole = role;
      }
    });
  }
  return primaryRole;
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = function(app, config) {
  var router = express.Router();
  var nano = require('nano')(config.couchAuthDbURL);
  var users = nano.use('_users');
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({
    extended: true
  }));
  router.use(expressSession({ secret: 'health matters', resave: true, saveUninitialized: false }));


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

  function findOAuthUser(accessToken, refreshToken, profile, callback) {
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
  }

  function findUser(userName, callback) {
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
  }

  // Use the GoogleStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Google
  //   profile), and invoke a callback with a user object.
  passport.use(
      new GoogleStrategy({
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: config.serverURL + '/auth/google/callback',
      }, findOAuthUser)
  );

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  router.use(passport.initialize());
  router.use(passport.session());
  // GET /auth/google
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Google authentication will involve
  //   redirecting the user to google.com.  After authorization, Google
  //   will redirect the user back to this application at /auth/google/callback
  router.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                              'https://www.googleapis.com/auth/userinfo.email',], }),
    function() {
      // The request will be redirected to Google for authentication, so this
      // function will not be called.
    });

  // GET /auth/google/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/#/login' }),
    function(req, res) {
      var user = req.user;
      var redirURL = '/#/finishgauth/';
      redirURL += user.consumer_secret;
      redirURL += '/' + user.token_secret;
      redirURL += '/' + user.consumer_key;
      redirURL += '/' + user.token_key;
      redirURL += '/' + user.name;
      redirURL += '/' + user.userPrefix;
      res.redirect(redirURL);
    }
  );

  router.post('/chkuser', function(req, res) {
    if (req.isAuthenticated()) {
      res.json({
        displayName: req.user.displayName,
        prefix: req.user.userPrefix,
        role: getPrimaryRole(req.user),
      });
    } else {
      findUser(req.body.name, function(err, user) {
        if (err) {
          res.json({error: true, errorResult: err});
        } else {
          res.json({
            displayName: user.displayName,
            prefix: user.userPrefix,
            role: getPrimaryRole(user),
          });
        }
      });
    }
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  app.use('/', router);
};
