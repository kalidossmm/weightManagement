var path = require('path'),
    config = require(path.join(process.cwd(), 'config')),
    logger = require('./src/logger'),
    restify = require('restify'),
    CookieParser = require('restify-cookies'),
    Fomatters = require('./src/formatters'),
    _ = require('lodash'),
    helmet = require('helmet'),
    serverStartUpEvent = require('./src/events/server_startup_event'),
    argv = require('yargs').argv,
    commonValidationChain = require('./src/validation_chain'),
    middlewares = require('./src/middlewares'),
    tools = require('./src/tools');

//Create a server with our logger and custom formatter
//Note that 'version' means all routes will default to
//1.0.0

var server = restify.createServer({
    name: config.server.name,
    log: logger,
    version: config.server.version,
    formatters: {
        'application/json': Fomatters.formatJSON,
        'text/html': Fomatters.formatHTMLReponse
    }
});

server.on('uncaughtException', function (req, res, route, err) {
    logger.error({err: err}, 'Restify uncaughtException');
    if (!res.headersSent) {
        res.send(new restify.InternalError({
            message: "Ups! A problem occurred processing your request. Please contact a system administrator. Details: " + err
        }));
    }
});

process.on('uncaughtException', function (err) {
    // try to log
    logger.fatal({err: err}, 'process uncaughtException');
    process.exit(1);
});

if (config.metrics) {
    metrics.init({
        server: server,
        logger: logger,
        awsConfig: config.metrics.awsConfig,
        config: config.metrics
    });
}

server.use(restify.fullResponse());

// Handles annoying user agents (curl)
server.pre(restify.pre.userAgentConnection());

// Set a per request bunyan logger (with requestid filled in)
server.use(restify.requestLogger());

// Serve content types such as [ 'application/json','text/html','text/plain','application/octet-stream','application/javascript' ]
server.acceptable.push('text/html');
server.use(restify.acceptParser(server.acceptable));

server.use(restify.dateParser());

server.use(restify.queryParser());

//Cookie parser
server.use(CookieParser.parse);


//Enabling CORS for all HTTP Verbs and routes for domain specified in config.server.corsOrigin
require('./lib/cors')(server, config.server.corsOrigins);

/*
 Middleware to set Cache-control headers to avoid client caching sensitive data.
 Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
 Pragma: no-cache
 Expires: 0
 Surrogate-Control: no-store
 */
server.use(helmet.noCache());

//Low level XSS filter
server.use(helmet.xssFilter());

//Disables Content-Type sniffing
server.use(helmet.noSniff());

//Parse body (Multipart and JSON supported)
middlewares.configureBodyParser(server);

//Enables XXS validation
server.use(commonValidationChain.validateParamsForXss);

function requestIdMiddleware(req, res, next) {
    const restifyRequestId = req.header('x-intel-request-id') || null;
    if (restifyRequestId) {
        req._id = restifyRequestId;
        res.setHeader('x-intel-request-id', restifyRequestId);
    }
    return next();
}

//Overridding request-id value provided by restify
server.use(requestIdMiddleware);

//Health handler
server.get(config.routes.healthCheckRouteName, require('./lib/health_handler'));

//Coverage reports publishing block
if (config.flags && config.flags.enableCoverage) {
    server.get(config.routes.coverageReports, function (req, res, next) {
        res.header('Location', config.routes.coverageReports + '/lcov-report/index.html');
        res.send(302);
        return next(false);
    });
    var coverageRouteRegEx = new RegExp(config.routes.coverageReports + '/lcov-report.*');

    server.get(coverageRouteRegEx, restify.serveStatic({
        directory: process.cwd(),
        default: 'index.html'
    }));
}

//API description for API management publishing block
if (config.flags && config.flags.enableApiDescription) {
    server.get(config.routes.apiDescription, restify.serveStatic({
        directory: process.cwd()
    }));
}


server.pre(function (req, res, next) {
    req.log.info("Request %s %s", req.method, req.url);
    next();
});

server.pre(function (req, res, next) {
    res.once('finish', function () {
        logger.info("Response sent", {statusCode: res.statusCode/*, body:  res._body*/});
    });
    next();
});

server.pre(requestContext.requestContextMiddleware);

exports.Server = server;


var port = config.server.port;
if (argv.port && parseInt(argv.port, 10)) {
    port = argv.port;
}

if (config.dynamodb) {
    tools.setAWSCredentials();
    var _this = this;
    exports.DynamodbAdaptor = require('./lib/dynamodb_adaptor');

    exports.exec = function (cb) {
        _this.DynamodbAdaptor.DynamoDBTableController.loadTables()
            .then(function onTableLoaded() {
                server.on('listening', function onServerStartUp() {
                    serverStartUpEvent.emit('serverStarted');
                    var consoleMessage = '\n \n %s Service is listening at %s';
                    logger.info(consoleMessage, server.name, server.url);
                    if (cb) {
                        cb();
                    }
                });

                server.on('error', function onServerError(ex) {
                    logger.fatal({err: ex}, 'Server encountered error');
                    serverStartUpEvent.emit('serverError', ex);
                });
                server.listen(port);
            });
    };
} else if (config.sequelize) {
    exports.SequelizeAdaptor = require('./lib/sequelize_adaptor');
    exports.SequelizeAdaptor.setupDB();

    exports.exec = function (cb) {
        server.on('listening', function onServerStartUp() {
            serverStartUpEvent.emit('serverStarted');
            var consoleMessage = '\n \n %s Service is listening at %s';
            logger.info(consoleMessage, server.name, server.url);
            if (cb) {
                cb();
            }
        });

        server.on('error', function onServerError(ex) {
            logger.fatal({err: ex}, 'Server encountered error');
            serverStartUpEvent.emit('serverError', ex);
        });
        server.listen(port);
    };
} else {
    server.on('listening', function onServerStartUp() {
        serverStartUpEvent.emit('serverStarted');
        var consoleMessage = '\n \n %s Service is listening at %s';
        logger.info(consoleMessage, server.name, server.url);
    });

    server.on('error', function onServerError(ex) {
        logger.fatal({err: ex}, 'Server encountered error');
        serverStartUpEvent.emit('serverError', ex);
    });
    server.listen(port);
}
