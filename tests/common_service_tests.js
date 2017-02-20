require('./configure');
var request = require('superagent'),
    logger = require('../lib/logger'),
    RequestUtil,
    mockPostData = {
        key1: '<script>',
        key2: '&lt;script&gt;'
    },
    mockQuery = 'field1=<script>&field2=&lt;script&gt;',
    _ = require('lodash');

require('superagent-proxy')(request);

module.exports = function(serviceEndPoint, routeDetailsArray, RequestUtility) {
    RequestUtil = RequestUtility;
    _.each(routeDetailsArray, function (routeDetails) {
        var url = serviceEndPoint + routeDetails.uri;
        runTests(routeDetails.method, url, routeDetails.params);
    })
}


var runTests = function(method, url, params) {
    describe("XSS Validation Testing Query", function(){
        it(method.toUpperCase() + " " + url, function(done) {
            url = url + (url.indexOf('?') > 0 ? '&' : '?') + mockQuery;
            var req = request[method](url);
            var requestCall = RequestUtil.setHeaders.call(req, params.token, params.isJsonType);
            if(method == 'POST' || method == 'PUT') {
                var requestCall = requestCall.send(mockPostData);
            }
            requestCall.end(function (error, res) {
                logger.debug(res.body);
                res.statusCode.should.equal(400);
                res.body.should.have.deep.property('error.code', 'BadRequestError');
                done();
            });
        });
    });

    describe("XSS Validation Testing Body", function(){
        if(method.toUpperCase() == 'POST' || method.toUpperCase() == 'PUT') {
            it(method.toUpperCase() + " " + url, function(done) {
                var req = request[method](url);
                var requestCall = RequestUtil.setHeaders.call(req, params.token, params.isJsonType);
                if(method == 'POST' || method == 'PUT') {
                    var requestCall = requestCall.send(mockPostData);
                }
                requestCall.end(function (error, res) {
                    logger.debug(res.body);
                    res.statusCode.should.equal(400);
                    res.body.should.have.deep.property('error.code', 'BadRequestError');
                    done();
                });
            })
        }
    });

    describe("Input returned in response For Application/json", function () {
        it(method.toUpperCase() + " " + url, function (done) {
            var req = request[method](url + "/wastedsdalfkhsdlfkhasldf");
            var requestCall = RequestUtil.setHeaders.call(req, params.token, params.isJsonType);
            if(method == 'POST' || method == 'PUT') {
                requestCall = requestCall.send(mockPostData);
            }
            requestCall.end(function (error, res) {
                logger.debug(res.body);
                res.body.should.exist;
                res.body.error.should.exist;
                res.body.error.message.should.not.match(/wastedsdalfkhsdlfkhasldf/);
                done();
            });
        });
    });

    describe("Input invalid url data should not be reflected, for types", function () {
        ["text/html", "text/plain"].forEach(function (type) {
            it(type + " and for " + method.toUpperCase() + " " + url, function (done) {
                var req = request[method](url + "/wastedsdalfkhsdlfkhasldf");
                var requestCall = RequestUtil.setHeaders.call(req, params.token, params.isJsonType);
                if (method == 'POST' || method == 'PUT') {
                    requestCall = requestCall.send(mockPostData);
                }
                requestCall
                    .set('Accept', type)
                    .end(function (error, res) {
                        res.body.should.not.match(/wastedsdalfkhsdlfkhasldf/);
                        done();
                    });
            });
        });

    });
};
