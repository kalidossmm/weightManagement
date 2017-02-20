require('./configure');
var cors = require('../src/cors'),
    request = require('supertest'),
    path = require('path'),
    fs = require('fs'),
    restify = require('restify'),
    server = restify.createServer();

describe("#formatJSON response handler tests", function () {
    before(function () {
        cors(server, 'http://localhost/');
        server.get('/user', function(req, res){
            res.send({ result: 'success' });
        });
    });

    it('#CORSHandler validation', function(done){
        request(server)
            .get('/user')
            .end(function (err, res) {
                if (err) return done(err);
                res.headers.should.have.property('access-control-expose-headers');
                done();
            });
    });
});
