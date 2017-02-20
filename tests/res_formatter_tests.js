require('./configure');
var formatter = {},
    path = require('path'),
    fs = require('fs'),
    tempFilePath = path.join(process.cwd(), 'tests/artifacts/test.json'),
    tempFile = fs.readFileSync(tempFilePath),
    mockConfigFolderPath = path.join(process.cwd(), 'config'),
    mockConfigFilePath = path.join(mockConfigFolderPath, 'index.js'),
    mockConfig = fs.readFileSync(path.join(process.cwd(), 'tests/config/index.js')),
    restify = require('restify'),
    sinon = require('sinon'),
    uuid = require('node-uuid');

var req = {
    method: 'POST',
    file: {
        path: ""
    },
    url: "/path/to/foo"
};

var res = {
    setHeader: function () {
    }
};

describe("#formatJSON response handler tests", function () {
    before(function () {
        fs.mkdirSync(mockConfigFolderPath);
        fs.writeFileSync(mockConfigFilePath, mockConfig);
        formatter = require('../src/formatters');
    });

    it('#formatHTMLReponse should set Content-Length and return body', function (done) {
        var testStatus = false;
        sinon.stub(res, "setHeader", function (header, value) {
            if (header == 'Content-Length') {
                expect(value).to.be.a('number');
                testStatus = true;
            }
        });
        formatter.formatHTMLReponse(req, res, tempFile, function (err, body) {
            expect(body).to.exist;
            res.setHeader.restore();
            expect(testStatus).to.eql(true);
            done();
        });
    });

   
    var notFoundError = new restify.ResourceNotFoundError({
        message: req.url + " does not exist"
    });

    it('#formatJSON should not reflect invalid user data in url', function (done) {
        var res = {
            setHeader: function () {
            },
            statusCode: 404
        };
        formatter.formatJSON(req, res, notFoundError, function (err, body) {
            expect(body).to.exist;
            body = JSON.parse(body);
            expect(body.error.message).not.to.contain(req.url);
            done();
        });
    });

    it('#formatHTMLReponse should not reflect invalid user data in url', function (done) {
        var res = {
            setHeader: function () {
            },
            statusCode: 404
        };
        formatter.formatHTMLReponse(req, res, notFoundError, function (err, body) {
            expect(body).to.exist;
            expect(body).not.to.contain(req.url);
            done();
        });
    });


    after(function () {
        fs.unlinkSync(mockConfigFilePath);
        fs.rmdirSync(mockConfigFolderPath);
        fs.writeFileSync(tempFilePath, tempFile);
    });
});