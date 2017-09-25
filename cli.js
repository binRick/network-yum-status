#!/usr/bin/env node

program = require('commander'),
    tasks = require('./tasks');

program
    .version('0.1.0')
    .option('-u, --unreachables', 'List Unreachables')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

if (program.unreachables) {
    tasks.unreachables(function(err, data) {
        if (err) throw err;
        console.log(data);
    });
}
