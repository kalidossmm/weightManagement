var restify = require('restify'),
    util = require('util'),
    InvalidContentError = function (errors) {
        restify.RestError.call(this, {
            statusCode: 406,
            body: {
                validationErrors: errors,
                code: 'InvalidContentError',
                message: 'Supplied content is not valid (invalid against JSON schema)',
            },
            constructorOpt: InvalidContentError
        });

        this.name = 'InvalidContentError';
    };

util.inherits(InvalidContentError, restify.RestError);
module.exports = InvalidContentError;
