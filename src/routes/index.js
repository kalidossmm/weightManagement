var config = require('../../../config'),
    path = require('path'),
        versionHandler = require('../../version-handler'),
    entitlementHandler = require("../../entitlement_handler");



module.exports = function (server) {
	server.use(entitlementHandler.authorizeRequests);

	server.get(config.routes.weightsGet, versionHandler);

	server.post(config.routes.weightsPost, versionHandler);
}