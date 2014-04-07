var config =  require('./config.js'), 
    couch_oauth = require('./couch-oauth.js'), 
    express = require('express'), 
    forward = require('./forward.js'),
    passport = require('passport'),
    util = require('util'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;  

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
        clientID: config.google_client_id,
        clientSecret: config.google_client_secret,
        callbackURL: config.server_url+'/auth/google/callback'
    }, couch_oauth)
);




var app = express();

// configure Express
app.configure(function() {
  app.use(forward(/\/db\/(.*)/, config.couch_db_url));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
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
  app.use(express.static(__dirname + '/public'));
});


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', function(req, res, next) {
    passport.authenticate('google', function(err, user, info) {
        if ((err && err.error && err.error === 'not_found') || !user) { 
            return res.redirect('/#/login');
        } else {
            var redir_url = '/#/?';
            redir_url += 's1='+user.consumer_secret;
            redir_url += '&s2='+user.token_secret;
            redir_url += '&k='+user.consumer_key;
            redir_url += '&t='+user.token_key;
            res.redirect(redir_url);
        }
    })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(config.server_port);