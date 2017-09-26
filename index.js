var config = require('./config'),
    fs = require('fs'),
    async = require('async'),
    pj = require('prettyjson'),
    redisServer = require('./redisServer.js'),
    redis = require('redis'),
    ora = require('ora'),
    c = require('chalk'),
    CronJob = require('cron').CronJob,
    parse = require('parse-spawn-args').parse,
    child = require('child_process'),
    secretConfig = require('./secretConfig'),
    hosts = ['servers'];


redisServer(function(err, redisPort) {
    console.log(c.green('  Redis listening on port ' + c.yellow.bgBlack(redisPort)));
    var redisClient = redis.createClient(redisPort);
    console.log(c.green('  Redis client connected!'));


    var yumCheckUpdates = function() {
        var checkSpinner = ora('Checking Yum Updates on ' + hosts.length + ' hosts...').start();
        var ansibleArgs = secretConfig.extraArgs + ' --extra-vars "yumUpdateDirectory=' + config.resultsDirectory + '"';
        ansibleArgs += __dirname + '/playbooks/yumCheckUpdate.yaml';
        ansibleArgs += ' -l ' + hosts.join(',');
        ansibleArgs = parse(ansibleArgs);
        var cmdOut = '';
        ansibleSpawn = child.spawn('ansible-playbook', ansibleArgs, {
            shell: true,
            env: {
                ANSIBLE_STDOUT_CALLBACK: 'json'
            },
        });
        ansibleSpawn.stdout.on('data', function(data) {
            cmdOut += data.toString();
        });
        ansibleSpawn.stderr.on('data', function(data) {});
        ansibleSpawn.on('error', function(dat) {
            console.log('error=', dat);
            process.exit(-1);
        });
        ansibleSpawn.on('exit', function(code) {
            var logFile = config.runsDirectory + '/' + Math.round(+new Date() / 1000) + '.json';

            fs.writeFileSync(logFile, cmdOut);

            if (code != 0) {
                checkSpinner.fail(c.red('  Yum Check Failed..'));
            } else {
                checkSpinner.succeed(c.green('  Yum Check Completed!'));
                var cmdOutJson = JSON.parse(cmdOut);
                console.log(pj.render(cmdOutJson.stats));
            }
        });

    };

    var yumCheckUpdatesCron = new CronJob({
        cronTime: '0 0 0 * * *',
        onTick: yumCheckUpdates,
        start: true,
        runOnInit: false,
    });
});
