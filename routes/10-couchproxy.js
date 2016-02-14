var forward = require('../forward.js');

module.exports = function(app, config) {
  app.use('/db/', forward(config.couchDbURL));
};
