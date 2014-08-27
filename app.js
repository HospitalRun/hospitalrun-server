var config =  require('./config.js'), 
    couch_auth = require('./couch-auth.js'), 
    express = require('express'), 
    follow = require('follow'),
    forward = require('./forward.js'),
    nano = require('nano')(config.couch_auth_db_url),
    maindb = nano.use('main'),
    passport = require('passport'),
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
    }, couch_auth.find_oauth_user)
);

var couchFollowOpts = {
    db: config.couch_auth_db_url+'/main',
    include_docs: true,
    since: config.couch_db_changes_since,
    query_params : {
        conflicts: true
    }
};
follow(couchFollowOpts, function(error, change) {
    if(!error) {
        if (change.doc && change.doc._conflicts) {
            var conflicts = change.doc._conflicts;
            
            maindb.get(change.id, {open_revs: JSON.stringify(conflicts)}, function(err, body) {
                var compareObj, 
                    currentDoc = change.doc,
                    currentModifiedDate,
                    i, 
                    key, 
                    modifiedDate, 
                    updateDocument = false,
                    updateProperty;
                if (!currentDoc.modifiedFields) {
                    currentDoc.modifiedFields = {};
                }
                if (err) {
                    console.log("ERROR GETTING CONFLICTING REVS: ",err);
                } else if (body.length) {
                    for (i=0;i<body.length;i++) {
                        compareObj = body[i].ok;
                        if (compareObj.modifiedFields) {
                            for (key in compareObj.modifiedFields) {
                                updateProperty = false;
                                modifiedDate = new Date(compareObj.modifiedFields[key]);
                                if (currentDoc.modifiedFields[key]) {
                                    currentModifiedDate = new Date(currentDoc.modifiedFields[key]);
                                    if (modifiedDate.getTime() > currentModifiedDate.getTime()) {
                                        updateProperty = true;
                                    }
                                } else {
                                    updateProperty = true;
                                }
                                if (updateProperty) {
                                    updateDocument = true;
                                    currentDoc.modifiedFields[key] = modifiedDate;
                                    currentDoc[key] = compareObj[key];
                                }
                            }
                        }
                    }
                    if (updateDocument) {
                        delete currentDoc._conflicts;
                        maindb.insert(currentDoc, currentDoc._id, function(err, response) {
                            if (!err && !response.ok) {
                                for (i=0;i< conflicts.length;i++) {
                                    maindb.destroy(currentDoc._id,  conflicts[i]);
                                }
                            }
                        });
                    }
                }
            });
        }
    }
});


var app = express();

// configure Express
app.configure(function() {
  app.use(forward(/\/db\/(.*)/, config.couch_db_url));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  //app.use(express.logger());
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
  function(){
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
      var redir_url = '/#/?';
      redir_url += 's1='+user.consumer_secret;
      redir_url += '&s2='+user.token_secret;
      redir_url += '&k='+user.consumer_key;
      redir_url += '&t='+user.token_key;
      redir_url += '&i='+user.name;
      redir_url += '&p='+user.userPrefix;
      res.redirect(redir_url);      
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.post('/chkuser', function(req, res){
    if (req.isAuthenticated()) {
        res.json({
            displayName: req.user.displayName,
            prefix: req.user.userPrefix,
            role: couch_auth.get_primary_role(req.user)
        });
    } else {
        couch_auth.find_user(req.body.name, function(err, user) {
            if (err) {
                res.json({error:true, errorResult: err});
            } else {
                res.json({
                    displayName: user.displayName,
                    prefix: user.userPrefix,
                    role: couch_auth.get_primary_role(user)
                });
            }            
        });
    }
});

app.listen(config.server_port);