var config =  require('./config.js');
var couchAuth = require('./couch-auth.js');
var express = require('express');
var follow = require('follow');
var forward = require('./forward.js');
var fs = require('fs');
var https = require('https');
var http = require('http');
var nano = require('nano')(config.couchAuthDbURL);
var maindb = nano.use('main');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var globSync   = require('glob').sync;
var dbListeners = globSync('./dblisteners/**/*.js', { cwd: __dirname }).map(require);
var server;

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


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
    new GoogleStrategy({
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.serverURL + '/auth/google/callback',
    }, couchAuth.findOAuthUser)
);

var couchFollowOpts = {
  db: config.couchAuthDbURL + '/main',
  include_docs: true,
  since: config.couchDbChangesSince,
  query_params: {
    conflicts: true,
  },
};
follow(couchFollowOpts, function(error, change) {
  if (!error) {
    dbListeners.forEach(function(listener) {
      listener(change, maindb, config);
    });
  }
});


var app = express();

// Configure Express
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
  if (config.logRequests) {
    app.use(express.logger(config.logFormat));
  }
  app.use('/patientimages', express.static(config.imagesdir));
  app.use(forward(/\/db\/(.*)/, config.couchDbURL));
  app.use(forward(/\/search\/(.*)/, config.searchURL));
  app.use(express.cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
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
app.get('/auth/google/callback',
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

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/chkuser', function(req, res) {
  if (req.isAuthenticated()) {
    res.json({
      displayName: req.user.displayName,
      prefix: req.user.userPrefix,
      role: couchAuth.getPrimaryRole(req.user),
    });
  } else {
    couchAuth.findUser(req.body.name, function(err, user) {
      if (err) {
        res.json({error: true, errorResult: err});
      } else {
        res.json({
          displayName: user.displayName,
          prefix: user.userPrefix,
          role: couchAuth.getPrimaryRole(user),
        });
      }
    });
  }
});

if (config.useSSL) {
  var options = {
    key: fs.readFileSync(config.sslKey),
    cert: fs.readFileSync(config.sslCert),
  };
  if (config.sslCA) {
    options.ca = [];
    config.sslCA.forEach(function(caFile) {
      options.ca.push(fs.readFileSync(caFile));
    });
  }
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

server.listen(config.serverPort, function listening() {
  console.log('HospitalRun server listening on %j', server.address());
});
