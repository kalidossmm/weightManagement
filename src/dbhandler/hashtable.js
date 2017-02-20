
var hashTableHandler = {},
    Q = require("q");



hashTableHandler.getData = function(query){
    return Q.resolve(query);
};

hashTableHandler.postData = function(data){
	    return Q.resolve(data);
};

exports.dbHandler = hashTableHandler;