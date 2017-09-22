var spawn = require('child_process').spawn,
    getPort = require('get-port'),
    parse = require('parse-spawn-args').parse;


getPort().then(function(port) {
    var args = parse('--port ' + port);
    var redisProcess = spawn('redis-server', args);
    redisProcess.stdout.on('data', function(d) {
        console.log('stdout: ' + d);
	if(d.toString().split('Ready to accept connections').length > 1){
		console.log('Redis ready on port ' + port);
	}
    });
    redisProcess.stderr.on('data', function(d) {
        console.log('stderr: ' + d);
    });
    redisProcess.on('exit', function(code) {
        console.log('redis exited with code ' + code);
    });
    process.on('exit', function() {
        redisProcess.kill();
    });
});
