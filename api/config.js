const join       = require('path').join;
const logFile    = require('fs').createWriteStream(join(__dirname, './logs/api.txt'), { flags: 'w' });
const ospreyAuth = require('./modules/security.js');
const util       = require('util');

const config = {
  spec: join(__dirname, './spec/hr-fhir-api.raml'),
  mountpoint: '/v1',
  ospreyConfig: {
    server: {
      notFoundHandler: false
    },
    security: ospreyAuth,
    disableErrorInterception: true
  },
  ramlOnError: (error, request, response, next) => {
    if (error) {
      // More granularity later, just 422 for now
      if (process.env.NODE_ENV !== 'production') {
        config.log(error);
        console.trace(error);
        return response.status(422).json({ message: 'Bad request', status: 422, error });
      } else {
        return response.status(422).json({ message: 'Bad request', status: 422, error: error.message });
      }
    }
    return next();
  },
  ramlOnNotFound: (request, response, next) => {
    if (request.resourcePath) {
      return next();
    }
    return response.status(404).json({ message: 'Not found', status: 404 });
  },
  log: function() {
    let where;
    try { throw Error() } catch (err) { where = err.stack; }
    logFile.write(`${where}\n` + util.inspect(arguments, { depth: null, colors: true }) + '\n');
  },
  error: (response, error) => {
    const message = { message: 'Something went wrong' };
    if (process.env.NODE_ENV !== 'production') {
      config.log(error)
      console.trace(error);
      message.error = error;
    }
    return response.status(500).json(message);
  }
};

module.exports = config;
