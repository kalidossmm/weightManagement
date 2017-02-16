var restify = require('restify'),
    allowedOrigins = ["*"],
    _ = require('lodash');

function quote(str) {
    return str.toString().replace(/[\\^$*+?.()|[\]{}]/g, "\\$&") + "$";
};

//converts domain name to RegExp
function convertToRegEx(origins) {
    return _.map(origins, function (origin) {
        return new RegExp(quote(origin));
    });
};

//Iterate overs the allowedOrigins array and performs request origin match
function isOriginAllowed(requestOrigin) {
    var allowed = false;
    _.each(allowedOrigins, function (origin) {
        return !(allowed = origin.test(requestOrigin));
    });
    return allowed;
};

//Middleware to set Access-Control-Allow-Origin header
function CORSHandler(req, res, next) {
    if (_.includes(allowedOrigins, "*") || isOriginAllowed(req.headers.origin)) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
    } else {
        res.header('Access-Control-Allow-Origin', "null");
    }
    res.header('Access-Control-Expose-Headers', restify.CORS.EXPOSE_HEADERS.join(', '));
    next();
};

function validateAndParseOrigins(origins) {
    return (!origins || origins.length === 0 || _.includes(origins, "*")) ? ['*'] : convertToRegEx(origins);
};

// @param(corsOrigins) : expects array of domain names

module.exports = function (server, corsOrigins) {
    allowedOrigins = validateAndParseOrigins(corsOrigins);

    //Enable default CORS Headers
    restify.CORS.ALLOW_HEADERS.push('Accept-Encoding');
    restify.CORS.ALLOW_HEADERS.push('Accept-Language');
    restify.CORS.ALLOW_HEADERS.push('authorization');


    //RegEx based CORS Handler
    server.use(CORSHandler);
};
