
var hashTableHandler = {},
    Q = require("q");



hashTableHandler.getData = function(query){
    return query;
};

hashTableHandler.postData = function(data){
	return data;
};

exports.dbHandler = hashTableHandler;