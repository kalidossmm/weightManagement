var restify = require('restify'),
    util = require('util'),
    InvalidVersionError = function() {
        restify.RestError.call(this, {
            statusCode: 400,
            restCode: 'InvalidVersionError',
            message: 'Requested Version not supported',
            constructorOpt: InvalidVersionError
        });

        this.name = 'InvalidVersionError';
    };

util.inherits(InvalidVersionError, restify.RestError);
module.exports = InvalidVersionError;