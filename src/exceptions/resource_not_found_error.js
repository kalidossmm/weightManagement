var restify = require('restify'),
    util = require('util');

function ResourceNotFoundError() {
    restify.RestError.call(this, {
        statusCode: 404,
        restCode: 'ResourceNotFoundError',
        message: 'Requested resource not found',
        constructorOpt: ResourceNotFoundError
    });

    this.name = 'ResourceNotFoundError';
}

util.inherits(ResourceNotFoundError, restify.RestError);
module.exports = ResourceNotFoundError;
