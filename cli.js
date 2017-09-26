#!/usr/bin/env node

program = require('commander'),
    tasks = require('./tasks');

program
    .version('0.1.0')
    .option('-u, --unreachables', 'List Unreachables')
    .option('-r, --reachables', 'List Reachables')
    .option('-R, --reachableresults', 'Reachable Results')
    .option('-s, --sorted', 'Sorted Quantity [qty]',5)
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);


 if (program.sorted) {
    tasks.topUpdates(program.sorted, function(err, data) {
        if (err) throw err;
        console.log(data);
    });
}

 if (program.reachableresults) {
    tasks.reachableResults(function(err, data) {
        if (err) throw err;
        console.log(data);
    });
}


if (program.reachables) {
    tasks.reachables(function(err, data) {
        if (err) throw err;
        console.log(data);
    });
}


if (program.unreachables) {
    tasks.unreachables(function(err, data) {
        if (err) throw err;
        console.log(data);
    });
}
