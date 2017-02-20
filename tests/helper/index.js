var serverStartUpEvent = require('../../src/events/server_startup_event'),
    path = require('path'),
    logger = require('../../src/logger');

var testData = {};
testData.weightData = [{"weight": 12, "datetime": "2016-12-30T10:10:10Z" }, {"weight": 12.5, "datetime": "2016-12-31T10:10:10Z" }];

exports.testData = testData;

var execServer = function (done) {
    if (process["isServerLoaded"]) {
        return done();
    }
    var packageJson = require(path.join(process.cwd(), 'package.json'));
    require(path.join(process.cwd(), packageJson.main));

    serverStartUpEvent.on('serverStarted', function onServerStartup() {
        process["isServerLoaded"] = true;
        if (done) {
            done();
        }
    });

    serverStartUpEvent.on('serverError', function onServerError(ex) {
        if (done) {
            done(ex);
        }   
    });
};

/*
 * Starts the server
 * */
exports.startServer = function (done) {
    if (process.env.SERVICE_END_POINT && !areRequestsRoutedLocally(process.env.SERVICE_END_POINT)) {
        //Don't start server, just continue
        done();
    } else {
        execServer(function setup(err) {
            if (!err) {
                return done();
            }

            if (err.code === 'EADDRINUSE') {
                //ignore
                logger.warn("Ignoring EADDRINUSE error!!!");
                process["isServerLoaded"] = true;

                done();
            } else {
                done(err);
            }
        });
    }
};

/*
 * Checks weather requests routed towards local service
 * @param: endPoint => Service endpoint, against which requests are made.
 * */
var areRequestsRoutedLocally = function (endPoint) {
    return (endPoint.indexOf("localhost") > 0 || endPoint.indexOf("127.0.0.1") > 0 );
};

exports.areRequestsRoutedLocally = areRequestsRoutedLocally;
