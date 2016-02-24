var config =  require('./config.js');
var express = require('express');
var follow = require('follow');
var fs = require('fs');
var https = require('https');
var http = require('http');
var nano = require('nano')(config.couchAuthDbURL);
var maindb = nano.use('main');
var morgan = require('morgan');
var globSync   = require('glob').sync;
var dbListeners = globSync('./dblisteners/**/*.js', { cwd: __dirname }).map(require);
var serverRoutes = require('hospitalrun-server-routes');
var setupAppDir = require('hospitalrun');
var server;


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
serverRoutes(app, config);
setupAppDir(app);
if (config.logRequests) {
  app.use(morgan(config.logFormat));
}
app.use('/patientimages', express.static(config.imagesdir));

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


