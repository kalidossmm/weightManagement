 var logger = require('../logger'),
    Q = require("q"),
    path = require('path'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    _ = require('lodash'),
    weightManagement = {},
    dbHandler = require('../dbhandler/hashTable').dbHandler,
    util = require('util');//,
    tools = require('../tools');

require('string-format');


weightManagement.postWeightDataQ = function(params) {
    var data = params.data;
    return dbHandler.postData(data)
        .then(function (result) {
            return {"response": "success"};
        }).catch(function (error) {
            logger.error('[models] >> [index] >> [postWeightDataQ] ==>', error);
            throw error;
        });
};

weightManagement.getWeightDataQ = function(params) {
	var query = {startDate: params.startDate | tools.getCurrentDateMinusTen, endDate: params.endDate | tools.getCurrentDate};
    return dbHandler.getData(query)
        .then(function(result){
        	//process the results as per the schema.
            var result = {
    "data": [{
        "weight": "10.2",
        "date": "2016-12-31T10:10:10Z"
    }, {
        "weight": "22.2",
        "date": "2016-12-30T10:10:10Z"
    }, {
        "weight": "10.2",
        "date": "2016-12-29T10:10:10Z"
    }],
    "aggregation": {
        "minWeight": 12.3,
        "maxWeight": 24.6,
        "averageWeight": 17,
        "changeInWeight": 12.0,
        "dateofMaxWeight": "2016-12-30T10:10:10Z",
        "dateofMinweight": "2016-12-31T10:10:10Z",
        "count": 12
    }
};
            return {result};  
        }).catch(function (error) {
            logger.error('[models] >> [index] >> [getWeightDataQ] ==>', error);
            throw error;
        });
};



module.exports.weightManagement = weightManagement;