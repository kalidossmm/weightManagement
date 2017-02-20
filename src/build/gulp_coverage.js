var path = require("path"),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    _ = require('lodash'),
    config = require(path.join(process.cwd(), 'config')),
    exit = require('gulp-exit'),
    logger = require('../logger');

module.exports = function (gulp, options) {

    var isSetUpTaskIncluded = function () {
        return options && options.includeSetupTask;
    };
    var tearDown = function (stream, err) {  
        stream.pipe(exit());
        (err) ? process.exit(1) : process.exit(0);
    };

    gulp.task('api-tests', function (cb) {
        return gulp.src(['tests/functional/*.js'])
            .pipe(mocha({
                timeout: 120000
            }))
            .pipe(exit());
    });

    gulp.task('pre-test', isSetUpTaskIncluded() ? ['setup'] : [], function (cb) {
        return gulp.src(['./*.js', './**/*.js', '!node_modules{,/**}', '!tests{,/**}', '!config{,/**}', '!build{,/**}', '!./**/coverage{,/**}', '!tmp{,/**}', '!gulpfile.js'])
            // Covering files
            .pipe(istanbul({    
                includeUntested: true
            }))
            // Force `require` to return covered files
            .pipe(istanbul.hookRequire());
    });

    gulp.task('test', ['pre-test'], function (cb) {
        var stream = gulp.src(['tests/**/*.js']).pipe(mocha({
            timeout: 120000
        }))
            .on('error', function onError(err) {
                tearDown(stream, err);
            });

        stream.pipe(istanbul.writeReports({
            dir: path.join(process.cwd(), 'reports')
        }))
            .on('error', function onError() {
                tearDown(stream);
            })
            .on('end', function onEnd() {
                tearDown(stream);
            });
        return stream;
    });
     //Installs, starts DynamoDB and will start the underlying server.
    gulp.task('setup', function setupTask(cb) {
        cb();
    });


};
