var request = require('request');

module.exports = function(pattern, host) {
  return function(req, res, next) {
    if (req.url.match(pattern)) {
      var dbPath = req.url.match(pattern)[1];
      var dbURL = [host, dbPath].join('/');
      var reqMethod = req.method.toLowerCase();
      if (reqMethod == 'delete') {
        reqMethod = 'del';
      }
      req.pipe(request[reqMethod](dbURL)).pipe(res);
    } else {
      next();
    }
  };
};
