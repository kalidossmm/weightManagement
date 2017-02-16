var _ = require('lodash');
var loadEnvConfig = function() {
	var config = {};
	if(process.env.NODE_ENV){
		config = require("./" + process.env.NODE_ENV);
	}else{
		config = require("./dev");
	}
	console.log(config);
	return _.merge(config, require('./common'));
}
module.exports = loadEnvConfig();