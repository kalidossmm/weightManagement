var weightManagement = require('../models/index').weightManagement,
    restify = require('restify'),
    logger = require('../logger');

var errorHandler = function (method, res, next) {
    return function (error) {
        logger.error({err: error, method: method}, 'Error in [timeseries_resource]');
        // TODO: in production, change this to some generic error
        next(new restify.InternalError({
            message: error.message
        }));
    };
};

exports.getWeightData = function (req, res, next) {
    var params = {
        userId: req.params.userId
    };
    logger.debug('WeightManagement request parameters >> [weight_resource] >> [getWeightData]',
        params);  
        logger.debug(weightManagement.getWeightDataQ(params));  
    weightManagement.getWeightDataQ(params)
        .then(function () {
 var data = "OK";
            return (data && data.results) ? res.send(200, data) :
                res.send(new restify.ResourceNotFoundError());
        })
        .fail(errorHandler("getWeightData", res, next));
};

exports.postWeightData = function (req, res, next) {
    var params = {
        userId: req.params.userId
    };
    logger.debug('WeightManagement request parameters >> [weight_resource] >> [postWeightData]',
        params);
    weightManagement.postWeightDataQ(params)
        .then(function() {
            data = "okok";
            return (data && data.results) ? res.send(200, data) :
                res.send(new restify.ResourceNotFoundError());
        })
        .fail(errorHandler("getWeightData", res, next));
};

    