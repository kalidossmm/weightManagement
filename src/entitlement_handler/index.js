var logger = require('../src/logger');

exports.authorizeRequests = function (req, res, next) {
    logger.debug("[entitlement_handler] >> [authorizeRequests]");
    return next();
};
