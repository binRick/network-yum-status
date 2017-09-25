#!/usr/bin/env node

program = require('commander'),
    tasks = require('./tasks');

program
    .version('0.1.0')
    .option('-l, --listruns', 'List Runs')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

if (program.listruns) {
    tasks.listRuns(function(err, runs) {
        if (err) throw err;
        console.log(runs);
    });
}
