const bodyParser   = require('body-parser');
const dbListeners  = require('hospitalrun-dblisteners');
const config       = require('./config.js');
const express      = require('express');
const fs           = require('fs');
const http         = require('http');
const https        = require('https');
const morgan       = require('morgan');
const osprey       = require('osprey');
const serverRoutes = require('hospitalrun-server-routes');
const setupAppDir  = require('hospitalrun');
const apiConfig    = require('./api/config.js');

dbListeners(config);
const app = express();
if (config.useSSL && config.useCertBot === true) {
  app.use('/.well-known', express.static(__dirname + '/public/.well-known', { dotfiles: 'allow' }));
  http.createServer(app).listen(80);
}
serverRoutes(app, config);
setupAppDir(app);
if (config.logRequests) {
  app.use(morgan(config.logFormat));
}
app.use('/patientimages', express.static(config.imagesdir));

let server;
if (config.useSSL) {
  const options = {
    key  : fs.readFileSync(config.sslKey),
    cert : fs.readFileSync(config.sslCert),
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

console.log('Loading raml proxy - this may take a while...');
osprey.loadFile(apiConfig.spec, apiConfig.ospreyConfig)
.then(middleware => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(apiConfig.mountpoint, middleware, osprey.Router(), require('./api/router/routes'));
  app.use(apiConfig.ramlOnNotFound);
  app.use(apiConfig.ramlOnError);


  server.listen(config.serverPort, function listening() {
    console.log('HospitalRun server listening on %j', server.address());
  });
})
.catch(e => apiConfig.log(e));
