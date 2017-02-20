 var logger = require('../logger'),
    Q = require("q"),
    path = require('path'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    _ = require('lodash'),
    weightManagement = {},
    dbHandler = require('../dbhandler/hashTable').dbHandler,
    util = require('util');//,
    //tools = require('../tools');

require('string-format');


weightManagement.postWeightDataQ = function(params) {
    var data = params.data;
    return dbHandler.postData(data)
        .then(function (result) {
            return {results: {data:true}};
        }).catch(function (error) {
            logger.error('[models] >> [index] >> [postWeightDataQ] ==>', error);
            throw error;
        });
};

weightManagement.getWeightDataQ = function(params) {
	var query = 'yes';//{startDate: params.startDate | tools.getCurrentDateMinusTen, endDate: params.endDate | tools.getCurrentDate};
    return dbHandler.getData(query)
        .then(function(result){
        	//process the results as per the schema.
            return {result: true};  
        }).catch(function (error) {
            logger.error('[models] >> [index] >> [getWeightDataQ] ==>', error);
            throw error;
        });
};



module.exports.weightManagement = weightManagement;