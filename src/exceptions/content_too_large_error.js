var restify = require('restify'),
    util = require('util'),
    ContentTooLargeError = function() {
        restify.RestError.call(this, {
            statusCode: 413,
            restCode: 'ContentTooLargeError',
            message: 'Content too large',
            constructorOpt: ContentTooLargeError
        });

        this.name = 'ContentTooLargeError';
    };

util.inherits(ContentTooLargeError, restify.RestError);
module.exports = ContentTooLargeError;