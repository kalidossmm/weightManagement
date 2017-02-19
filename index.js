var path = require('path'),
    config = require(path.join(process.cwd(), 'config')),
    logger = require('./src/logger'),
    restify = require('restify'),
    CookieParser = require('restify-cookies'),
    Fomatters = require('./src/formatters'),
    _ = require('lodash'),
    helmet = require('helmet'),
    serverStartUpEvent = require('./src/events/server_startup_event'),
    argv = require('yargs').argv;
 
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
require('./src/cors')(server, config.server.corsOrigins);

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
//middlewares.configureBodyParser(server);

//Enables XXS validation
//server.use(commonValidationChain.validateParamsForXss);

function requestIdMiddleware(req, res, next) {
    const restifyRequestId = req.header('kd-request-id') || null;
    if (restifyRequestId) {
        req._id = restifyRequestId;
        res.setHeader('kd-request-id', restifyRequestId);
    }
    return next();
}

//Overridding request-id value provided by restify
server.use(requestIdMiddleware);


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

//server.pre(requestContext.requestContextMiddleware);


var port = config.server.port;
if (argv.port && parseInt(argv.port, 10)) {
    port = argv.port;
}

require('./src/routes')(server);


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