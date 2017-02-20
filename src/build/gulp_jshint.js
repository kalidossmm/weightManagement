module.exports = function (gulp) {
    var jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish');

    gulp.task('jshint', function (cb) {
        return gulp.src(['./*.js', './**/*.js', '!node_modules{,/**}', '!tests{,/**}', '!config{,/**}', '!build{,/**}','!./**/coverage{,/**}'])
            .pipe(jshint())
            .pipe(jshint.reporter(stylish));
    });
};
