var restify = require('restify'),
    util = require('util'),
    InvalidContentTypeError = function(errorMessage) {
        restify.RestError.call(this, {
            statusCode: 415,
            restCode: 'InvalidContentTypeError',
            message: (errorMessage) ? errorMessage : 'Only application/json format is supported',
            constructorOpt: InvalidContentTypeError
        });

        this.name = 'InvalidContentTypeError';
    };

util.inherits(InvalidContentTypeError, restify.RestError);
module.exports = InvalidContentTypeError;