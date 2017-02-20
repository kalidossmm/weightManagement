require('./configure');
var validator = {},
    path = require('path'),
    fs = require('fs'),
    tempFilePath = path.join(process.cwd(), 'tests/artifacts/test.json'),
    mockConfigFolderPath = path.join(process.cwd(), 'config'),
    mockConfigFilePath = path.join(mockConfigFolderPath, 'index.js'),
    mockConfig = fs.readFileSync(path.join(process.cwd(), 'tests/config/index.js')),
    _ = require('lodash'),
    Joi = require('joi');

describe("validation chain tests", function () {
    before(function () {
        fs.mkdirSync(mockConfigFolderPath);
        fs.writeFileSync(mockConfigFilePath, mockConfig);
        validator = require('../lib/validation_chain');
    });

    describe("#validateUserIdParam validation tests", function () {
        it('should not throw error if userId exists', function(done) {
            var req = {
                params: {
                    userId: 'someID'
                }
            };
            validator.validateUserIdParam(req, null, function next(err) {
                expect(err).to.not.exist;
                done();
            });
        });
        it('should throw error is userId does not exists', function(done) {
            var req = {
                params: {}
            };
            validator.validateUserIdParam(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'MissingUserIdError');
                done();
            });
        });
    });

    describe("#validateProductIdParam validation tests", function () {
        it('should not throw error if productId exists', function(done) {
            var req = {
                params: {
                    productId: 'someID'
                }
            };
            validator.validateProductIdParam(req, null, function next(err) {
                expect(err).to.not.exist;
                done();
            });
        });
        it('should throw error is productId does not exists', function(done) {
            var req = {
                params: {}
            };
            validator.validateProductIdParam(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'MissingProductIdError');
                done();
            });
        });
    });

    describe("#validateAssetTypeParam validation tests", function () {
        it('should not throw error if assetType exists', function(done) {
            var req = {
                params: {
                    assetType: 'someID'
                }
            };
            validator.validateAssetTypeParam(req, null, function next(err) {
                expect(err).to.not.exist;
                done();
            });
        });
        it('should throw error is assetType does not exists', function(done) {
            var req = {
                params: {}
            };
            validator.validateAssetTypeParam(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'MissingAssetTypeError');
                done();
            });
        });
    });

    describe("#validateAssetIdParam validation tests", function () {
        it('should not throw error if assetId exists', function(done) {
            var req = {
                params: {
                    assetId: 'someID'
                }
            };
            validator.validateAssetIdParam(req, null, function next(err) {
                expect(err).to.not.exist;
                done();
            });
        });
        it('should throw error is assetId does not exists', function(done) {
            var req = {
                params: {}
            };
            validator.validateAssetIdParam(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'MissingAssetIdError');
                done();
            });
        });
    });

    describe("#validateDocumentIdParam validation tests", function () {
        it('should not throw error if docId exists', function(done) {
            var req = {
                params: {
                    docId: 'someID'
                }
            };
            validator.validateDocumentIdParam(req, null, function next(err) {
                expect(err).to.not.exist;
                done();
            });
        });
        it('should throw error is docId does not exists', function(done) {
            var req = {
                params: {}
            };
            validator.validateDocumentIdParam(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'MissingDocIdError');
                done();
            });
        });
    });

    describe("#validateDeviceIdParam validation tests", function () {
        it('should not throw error if deviceId exists', function(done) {
            var req = {
                params: {
                    deviceId: 'someID'
                }
            };
            validator.validateDeviceIdParam(req, null, function next(err) {
                expect(err).to.not.exist;
                done();
            });
        });
        it('should throw error is deviceId does not exists', function(done) {
            var req = {
                params: {}
            };
            validator.validateDeviceIdParam(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'MissingDeviceIdError');
                done();
            });
        });
    });

    describe("#validateS3ObjectUrl validation tests", function () {
        it('should not throw error if assetUrl is valid', function(done) {
            var req = {
                body: {
                    service: {
                        assetUrl: '://s3.amazonaws.com/a'
                    }
                }
            };
            validator.validateS3ObjectUrl('service')(req, null, function next(err) {
                expect(err).to.not.exist;
                done();
            });
        });
        it('should throw error if assetUrl is invalid', function(done) {
            var req = {
                body: {
                    service: {
                        assetUrl: 'http://www.google.com'
                    }
                }
            };
            validator.validateS3ObjectUrl('service')(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'InvalidS3ObjectUrl');
                done();
            });
        });
    });

    describe("#validateFileAttachment validation tests", function () {
        it('should not throw error if file is attached', function(done) {
            var req = {
                file: {
                    fieldname: require(mockConfigFilePath).formFieldNames.ASSET_PAYLOAD
                }
            };
            validator.validateFileAttachment(req, null, function next(err) {
                expect(err).to.not.exist;
                done();
            });
        });
        it('should throw error is file is not attached', function(done) {
            var req = {
                file: {}
            };
            validator.validateFileAttachment(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'MissingFileAttachmentError');
                done();
            });
        });
    });

    describe("#validateFileName validation tests", function () {
        it('should not throw error if filename is valid', function(done) {
            var req = {
                file: {
                    originalname: 'afile.txt'
                }
            };
            validator.validateFileName(req, null, function next(err) {
                expect(err).to.not.exist;
                done();
            });
        });
        it('should throw error is filenameis invalid', function(done) {
            var req = {
                file: {
                    originalname: 'afile$.txt'
                }
            };
            validator.validateFileName(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'InvalidFilenameError');
                done();
            });
        });
    });

    describe("#assetHash validation tests", function () {
        before(function (done) {
            var tools = require('../lib/tools');
            tools.generateAssetHash(tempFilePath)
                .then(function (hash) {
                    req.params.swAssetInfo.assetHash = hash;
                    hashToAssert = hash;
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        var req = {
            file: {
                path: ""
            }
        };
        req.file.path = tempFilePath;
        req.params = {
            swAssetDescription: {
                "arbitraryData2": "12334567",
                "arbitraryData1": "kln5298nmwe98ru234j89224r9"
            },
            swAssetInfo: {
                assetVersion: '0.0.0',
                assetType: "Firmware",
                productId: '1',
                tenantId: "ndgFightClub",
                assetLanguage: "en-US",
                assetDateTimeStamp: (new Date()).toISOString()
            }
        };
        var hashToAssert;


        it("#should validate the assetHash that is provided in the request ", function (done) {
            validator.validateAssetHash("swAssetInfo")(req, null, function next(err) {
                expect(err).to.not.exist;
                req.params.should.have.deep.property('swAssetInfo.assetHash', req.params.swAssetInfo.assetHash);
                done();

            });
        });

        it("#should throw error in case of assetHash provided in the request and the generated assetHash mismatch ", function (done) {
            req.params.swAssetInfo.assetHash = '0a5c68f4fb653e8a3d8aa04bbcd4c619c43a453bcdefba8e8e05826e9b8c519c';
            validator.validateAssetHash("swAssetInfo")(req, null, function next(err) {
                expect(err).to.have.property('restCode', 'AssetHashValidationError');
                done();

            });
        });

        it("#should populate assetHash when it is not provided in the request", function (done) {
            req.params.swAssetInfo = _.omit(req.params.swAssetInfo, "assetHash");
            validator.validateAssetHash("swAssetInfo")(req, null, function next(err) {
                expect(err).to.not.exist;
                req.params.should.have.deep.property('swAssetInfo.assetHash', hashToAssert);
                done();

            });
        });
    });
    describe("#contentType validation tests", function () {


        var req = {
            headers: {}
        };

        it("#should not throw error if request has valid contentType(application/json)", function (done) {
            req.headers['content-type'] = 'application/json';
            validator.validateJsonContentType(req, null, function next(err) {
                expect(err).to.not.exist;
                done();

            });
        });

        it("#should throw error if contentType is not application/json", function (done) {
            req.headers['content-type'] = 'text/plain';
            validator.validateJsonContentType(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'InvalidContentTypeError');
                done();
            });
        });

        it("#should throw error if contentType is undefined", function (done) {
            req.headers['content-type'] = undefined;
            validator.validateJsonContentType(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'InvalidContentTypeError');
                done();
            });
        });

        it("#should not throw error if request has valid contentType(multipart/form-data) ", function (done) {
            req.headers['content-type'] = 'multipart/form-data';
            validator.validateMultipartFormDataContentType(req, null, function next(err) {
                expect(err).to.not.exist;
                done();

            });
        });

        it("#should throw error if contentType is not multipart/form-data", function (done) {
            req.headers['content-type'] = 'text/plain';
            validator.validateMultipartFormDataContentType(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('restCode', 'InvalidContentTypeError');
                done();

            });
        });

    });

    describe("#filterSchemaAttributes test", function () {
        it("should filter out all the attributes which are specified in the schema and nonSchemaAttributeArray", function (done) {
            var PersonSchema = {
                email: Joi.string().email().required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                OtherInfo: Joi.object().keys({
                    maritalStatus: Joi.string()
                })
            };
            var req = {
                params: {
                    email: "abc@g.com",
                    firstName: "A",
                    lastName: "B",
                    OtherInfo: {
                        maritalStatus: "Single"
                    },
                    someNonSchemaAttribute: {
                        someStringValue: "string",
                        someIntValue: 0,
                        someObject: {}
                    },
                    notAllowedProperty: "denyme"
                }
            };
            validator.filterSchemaAttributes(PersonSchema, ["someNonSchemaAttribute"])(
                req,
                null,
                function next() {
                    expect(req.params).should.exist;
                    expect(req.paramsInput).should.exist;
                    req.paramsInput.should.have.property("email", req.params.email);
                    req.paramsInput.should.have.property("firstName", req.params.firstName);
                    req.paramsInput.should.have.property("lastName", req.params.lastName);
                    req.paramsInput.should.have.deep.property("OtherInfo.maritalStatus", req.params.OtherInfo.maritalStatus);
                    req.paramsInput.should.have.property("someNonSchemaAttribute");

                    req.paramsInput.should.have.deep.property("someNonSchemaAttribute.someStringValue", req.params.someNonSchemaAttribute.someStringValue);
                    req.paramsInput.should.have.deep.property("someNonSchemaAttribute.someIntValue", req.params.someNonSchemaAttribute.someIntValue);
                    req.paramsInput.should.have.deep.property("someNonSchemaAttribute.someObject");

                    req.paramsInput.should.not.have.property("notAllowedProperty");
                    done();
                }
            );

        });
    });

    describe("#XSS validation tests", function () {
        var req = {
            params: {}
        };

        it("#should not throw error if request has valid parameters(without HTML tags)", function (done) {
            req.params['query'] = 'Some Content';
            validator.validateParamsForXss(req, null, function next(err) {
                expect(err).to.not.exist;
                done();

            });
        });

        it("#should throw error if request has invalid parameters(with HTML tags) in query", function (done) {
            req.params['query'] = 'Some Content with HTML <malious>sss</malicious>tags ';
            validator.validateParamsForXss(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('message', 'Invalid Input');
                done();
            });
        });

        it("#should throw error if request has invalid parameters(with HTML tags) in body and params", function (done) {
            req.query = {"key": 'Some Content with HTML <malious>sss</malicious>tags '};
            req.body = {"key": 'Some Content with HTML <malious>sss</malicious>tags '};
            validator.validateParamsForXss(req, null, function next(err) {
                expect(err).to.exist;
                expect(err).to.have.property('message', 'Invalid Input');
                done();
            });
        });
    });

    after(function () {
        fs.unlinkSync(mockConfigFilePath);
        fs.rmdirSync(mockConfigFolderPath);
    });
});
