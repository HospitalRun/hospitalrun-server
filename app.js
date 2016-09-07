var config =  require('./config.js');
var dbListeners = require('hospitalrun-dblisteners');
var express = require('express');
var fs = require('fs');
var https = require('https');
var http = require('http');
var morgan = require('morgan');
var serverRoutes = require('hospitalrun-server-routes');
var setupAppDir = require('hospitalrun');
var server;

dbListeners(config);
var app = express();
if (config.useSSL && config.useCertBot === true) {
  app.use('/.well-known', express.static(__dirname + '/public/.well-known', {dotfiles: 'allow'}));
  http.createServer(app).listen(80);
}
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


