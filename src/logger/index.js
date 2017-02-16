var bunyan = require('bunyan'),
    path = require("path"),
    fs = require("fs"),
    restify = require('restify'),
    config = {},
    configPath = path.join(process.cwd(), "config"),
    bformat = require('bunyan-format'),
    formatOut = bformat({ outputMode: 'bunyan', levelInString: true });

if (fs.existsSync(configPath)) {
    config = require(configPath);
}

var logger = bunyan.createLogger({
    name: 'logger',
    streams: [{
        stream: formatOut,
        level: (config.logger && config.logger.level) || 'debug'
    }],
    serializers: restify.bunyan.serializers
});

logger.on('error', function (err, stream) {
    // Handle stream write or create error here.
    console.error("Logger is broken", {component: 'ndg-logger', error: err, timestamp: new Date().toISOString()});
});

module.exports = logger;

