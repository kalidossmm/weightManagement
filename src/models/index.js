 var logger = require('../src/logger'),
    Q = require("q"),
    path = require('path'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    _ = require('lodash'),
    weightDBService = {},
    util = require('util'),
    tools = require('../tools');

require('string-format');

var dbClient = require('../dbhander/hashTable');

weightDBService.getWeightDataQ = function(params) {
	var query = {startDate: params.startDate | tools.getCurrentDateMinusTen, endDate: params.endDate | tools.getCurrentDate};
    console.log(query);
    return Q.ninvoke(dbClient.getData, 'query', query)
        .then(function (result) {
        	//process the results as per the schema.
            return {
                results
            };
        }).catch(function (error) {
            logger.error('[models] >> [index] >> [getWeightDataQ] ==>', error);
            throw error;
        });
};

weightDBService..postWeightDataQ = function(params) {
	var data = {params.data};
    return Q.ninvoke(dbClient.postData, 'data', data)
        .then(function (result) {
            return { };
        }).catch(function (error) {
            logger.error('[models] >> [index] >> [postWeightDataQ] ==>', error);
            throw error;
        });
};

module.exports.weightDBService = weightDBService;