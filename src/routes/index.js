var config = require('../../config'),
    path = require('path'),
        versionHandler = require('../version'),
    entitlementHandler = require("../entitlement");



module.exports = function (server) {
	server.use(entitlementHandler.authorizeRequests);

	server.get(config.routes.weightsGet, versionHandler);
	server.post(config.routes.weightsPost, versionHandler);
}