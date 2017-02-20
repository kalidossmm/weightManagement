var fs = require('fs'),
    psTree = require('ps-tree'),
    path = require('path'),
    config = require(path.join(process.cwd(), 'config')),
    spawn = require('child_process').spawn,
    gulpRunProcessPIdFile = path.join(process.cwd(), 'tmp/node.pid'),
    processHandler = {},
    Q = require('q');

module.exports = function (gulp) {
    if (!gulp) {
        return processHandler;
    }

    gulp.task('run', function () {
        var command = spawn('nohup', ['node', 'server.js'], {stdio: 'inherit'});
        if (!fs.existsSync(path.join(process.cwd(), '/tmp'))){
            fs.mkdirSync(path.join(process.cwd(), '/tmp'));
        }
        fs.writeFile(gulpRunProcessPIdFile,
            command.pid, function (error) {
                if (error) {
                    console.log("Error while capturing process pid", error);
                }
                console.log("Captured pid", command.pid);
            });
    });

    gulp.task('kill-process', function () {
        try {
            var data = fs.readFileSync(gulpRunProcessPIdFile, "UTF-8");
            if (data) {
                console.log("pid", data);
                processHandler.kill(data);
            }
        } catch (err) {
            console.log("Error", err);
        }
    });
    return processHandler;
};

processHandler.kill = function (pid, killTree, signal) {
    signal = signal || 'SIGKILL';
    killTree = killTree || true;
    var deferred = Q.defer();
    if (killTree) {
        psTree(pid, function (err, children) {
            [pid].concat(
                children.map(function (p) {
                    return p.PID;
                })
            ).forEach(function (tpid) {
                    try {
                        process.kill(tpid, signal);
                    } catch (ex) {
                        deferred.reject(ex);
                    }
                });
            deferred.resolve();
        });
    } else {
        try {
            process.kill(pid, signal);
        } catch (ex) {
            deferred.reject(ex);
        }
        deferred.resolve();
    }
    return deferred.promise;
};
