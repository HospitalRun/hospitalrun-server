let bodyParser   = require('body-parser');
var config       = require('./config.js');  // require('./config-remote-couchdb.js');
var dbListeners  = require('hospitalrun-dblisteners');
var express      = require('express');
var fs           = require('fs');
var http         = require('http');
var https        = require('https');
var join         = require('path').join
var morgan       = require('morgan');
var osprey       = require('osprey');
var serverRoutes = require('hospitalrun-server-routes');
var setupAppDir  = require('hospitalrun');

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

var server;
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
osprey.loadFile(join(__dirname, 'api/spec/hr-fhir-api.raml'))
.then(middleware => {
  app.use('/v1', middleware, osprey.Router(), require('./api/router/routes'));

  server.listen(config.serverPort, function listening() {
    console.log('HospitalRun server listening on %j', server.address());
  });
})
.catch(e => console.error(e));
