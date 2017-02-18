var path = require('path'),
    weightResource = require('../resources/weight_resource'),
    config = require(path.join(process.cwd(), 'config')),
    routeHandlersMap = {
        'get': {},
        'post': {}
    };

routeHandlersMap.delete[config.routes.weightsGet] = weightResource.getWeightData;
routeHandlersMap.get[config.routes.weightsPost] = weightResource.postWeightData;

module.exports = {
    routeHandlersMap[req.route.method.toLowerCase()][req.route.path](req, res, next);
}