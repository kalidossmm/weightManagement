var _ = require('lodash'),
    config = require(require('path').join(process.cwd(), 'config')),
    Errors = require("../exceptions"),
    logger = require('../logger');

exports.formatJSON = function (req, res, body, cb) {
    if (body instanceof Error) {
        // snoop for RestError or HttpError, but don't rely on
        // instanceof
        res.statusCode = body.statusCode || 500;

        if (body.body) {
            body = body.body;
        } else {
            body = {
                message: body.message
            };
        }
        // Moving body object properties to body.error to match up the error JSON Schema as specified in the Spec
        var bodyPart = _.cloneDeep(body);
        body = _.each(_.keys(body), function (key) {
            _.omit(body, key);
        });
        body = {
            error: bodyPart
        };
        // if input url reflected in the resource not found error, remove it
        body = removeInputReflectionInJSONResponse(body, req);

    } else if (Buffer.isBuffer(body)) {
        body = body.toString('base64');
    }

    var data;
    if (body) {
        data = JSON.stringify(body);
        res.setHeader('Content-Length', Buffer.byteLength(data));
        tempFileCleanUp(req);
    }
   // setRequestIdHeader(res);
    
    return cb(null, data);
};

exports.formatHTMLReponse = function formatText(req, res, body, cb) {
    // if input url reflected in the resource not found error, remove it
    if (body instanceof Error && res.statusCode === 404) {
        body.message = "";
    }

    body = body.toString();
    res.setHeader('Content-Length', Buffer.byteLength(body));
    setRequestIdHeader(res);
    return cb(null, body);
};

// cleanup uploaded files in case,
// multer (also removes temp in case of errors)
// otherwise if s3UploadService.uploadToS3Q fails to delete a temp uploaded file
var tempFileCleanUp = function (req) {
    var method = req.method.toLowerCase();
    if (method !== "post" && method !== "put")
        return;

};

var removeInputReflectionInJSONResponse = function (body, req) {
    if (body.error && body.error.message && (body.error.message.indexOf(req.url) !== -1)) {
        body.error.message = "";
    }
    return body;
};
