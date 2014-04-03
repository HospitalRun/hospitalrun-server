var request = require('request');

module.exports = function(pattern, host){
    return function(req, res, next){
        if(req.url.match(pattern)){
            var db_path = req.url.match(pattern)[1]
                , db_url = [host, db_path].join('/');
            console.log("proxying to: "+db_url);
            req.pipe(request[req.method.toLowerCase()](db_url)).pipe(res);
        } else {
            console.log("skipping: "+req.url);
            next();
        }
    }
}
