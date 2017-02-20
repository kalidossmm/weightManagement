var path = require('path'),
    weightResource = require('../resources/weight_resource'),
    config = require(path.join(process.cwd(), 'config')),
    routeHandlersMap = {
        'get': {},
        'post': {}
    };
routeHandlersMap.get[config.routes.weightsGet] = weightResource.getWeightData;
routeHandlersMap.post[config.routes.weightsPost] = weightResource.postWeightData;

module.exports = function (req, res, next) {
    routeHandlersMap[req.route.method.toLowerCase()][req.route.path](req, res, next);
}