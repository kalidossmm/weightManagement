
exports.getWeightData = function (req, res, next) {
    var params = {
        userId: req.params.userId
    };
    logger.debug('WeightManagement request parameters >> [weight_resource] >> [getWeightData]',
        params);
    commonDB.getWeightDataQ(params)
        .then(function (data) {
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
    commonDB.postWeightDataQ(params)
        .then(function (data) {
            return (data && data.results) ? res.send(200, data) :
                res.send(new restify.ResourceNotFoundError());
        })
        .fail(errorHandler("getWeightData", res, next));
};

