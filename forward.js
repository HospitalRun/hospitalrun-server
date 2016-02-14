var request = require('request');

module.exports = function(host) {
  return function(req, res) {
    var forwardURL = host + req.url;
    var reqMethod = req.method.toLowerCase();
    if (reqMethod == 'delete') {
      reqMethod = 'del';
    }
    req.pipe(request[reqMethod](forwardURL).on('error', function(err) {
      console.log('Got error forwarding: ', err);
    })).pipe(res);
  };
};
