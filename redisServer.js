var spawn = require('child_process').spawn,
    getPort = require('get-port'),
    parse = require('parse-spawn-args').parse;

module.exports = function(_cb) {
    getPort().then(function(port) {
        var args = parse('--port ' + port);
        var redisProcess = spawn('redis-server', args);
        redisProcess.stdout.on('data', function(d) {
            if (d.toString().split('The server is now ready to accept connections').length>1 || d.toString().split('Ready to accept connections').length > 1) {
                _cb(null, port);
            }
        });
        redisProcess.stderr.on('data', function(d) {
        });
        redisProcess.on('exit', function(code) {
            console.log('redis exited with code ' + code);
        });
        process.on('exit', function() {
            redisProcess.kill();
        });
    });
};
