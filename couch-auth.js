var config =  require('./config.js'), 
    nano = require('nano')(config.couch_auth_db_url),
    serializer = require('serializer'),
    users = nano.use('_users');  

function create_oauth_tokens(secret_base, user, callback) {
    var consumer_key = serializer.randomString(96);
    var token_key = serializer.randomString(96);    
    user.oauth = {
        consumer_keys: {},
        tokens: {}
    };
    user.oauth.consumer_keys[consumer_key] = create_secret(secret_base);    
    user.oauth.tokens[token_key] = create_secret(secret_base);
    users.insert(user, user._id, function(err, response) {
        if (err || !response.ok) {
            console.log("ERROR Updating user with credentials:");
            console.dir(response);
            callback(response);            
        } else {
            callback(null, denormalize_oauth(user));
        }
    });
}

function create_secret(secret_base) {
    var encrypt_key = serializer.randomString(48);
    var validate_key = serializer.randomString(48);
    var secret_string = serializer.secureStringify(secret_base, encrypt_key, validate_key);
    if (secret_string.length > 80) {
        secret_string = secret_string.substr(30,50);    
    }
    return secret_string;
}

function denormalize_oauth(user) {
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

function is_admin(user) {
    var isAdmin = false;
    if (user.roles) {
        user.roles.forEach(function(role) {
            if (role === 'admin') {
                isAdmin = true;
            }
        });
    }
    return isAdmin;
}

function validate_oauth(oauth) {
    try {
        if (Object.keys(oauth.consumer_keys).length > 0 && Object.keys(oauth.tokens).length > 0) {
            return true;
        }
    } catch (ex) {
        //oauth is bad, just let the false return;
    }
    return false;
}
                                
module.exports = {
    delete_user: function(user, idToDelete, rev, res) {
        if(is_admin(user)) {
            users.destroy(idToDelete, rev, function(err, body) {
                if (err) {
                    res.json({error:true, errorResult: err});
                } else {
                    res.json(body);
                }
            });
        }
    },
    
    find_oauth_user: function(accessToken, refreshToken, profile, callback) {        
        var user_key = 'org.couchdb.user:'+profile._json.email;
        users.get(user_key, {}, function(err, body) {
            if (err) {
                callback(err);
                return;
            }        
            if (validate_oauth(body.oauth)) {
                callback(null, denormalize_oauth(body));            
            } else {
                create_oauth_tokens(accessToken, body, callback);
            }
        });
    },
    
    find_user: function(userName, callback) {
        var user_key = 'org.couchdb.user:'+userName;
        users.get(user_key, {}, function(err, body) {
            if (err) {
                callback(err);
                return;
            }        
            callback(null, body);
        });    
    },
    
    get_user: function(user, id, res) {
        if(is_admin(user)) {
            this.find_user(id, function(err, body) {
                if (err) {
                    res.json({error:true, errorResult: err});
                } else {
                    res.json(body);
                }
            });
        }
    },
    
    get_users: function(user, res) {
        if(is_admin(user)) {
            var options = {
                include_docs: true,
                startkey: 'org.couchdb.user'
            };
            users.list(options, function (err, body) {
                if (err) {
                    res.json({error:true, errorResult: err});
                } else {
                    res.json(body);
                }
            });
        } else {
            res.json({error:true, errorResult: 'Unauthorized'});
        }
    },
    
    get_primary_role: function(user) {
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
    
    update_user: function(user, userData, updateParams, res) {
        if(is_admin(user)) {
            users.insert(userData, updateParams, function(err, body) {
                if (err) {
                    res.json({error:true, errorResult: err});
                } else {
                    res.json(body);
                }
            });
        }
    },

};
