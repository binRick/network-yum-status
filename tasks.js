var config = require('./config'),
    dir = require('node-dir'),
    _ = require('underscore'),
    path = require('path'),
    fs = require('fs');


module.exports = {
    unreachables: function(_cb) {
        this.latestStats(function(err, stats) {
            console.log(stats);
            var fails = [];
            _.each(_.keys(stats), function(s) {
                if (stats[s].unreachable > 0)
                    fails.push(s);
            });
            _cb(err, fails);
        });
    },
    latestStats: function(_cb) {
        this.latestRunData(function(err, data) {
            _cb(err, data.stats);
        });
    },
    listRuns: function(_cb) {
        dir.readFiles(config.runsDirectory, {
                match: /.json$/,
                exclude: /^\./
            }, function(err, content, next) {
                if (err) throw err;
                next();
            },
            function(err, files) {
                if (err) throw err;
                _cb(err, files);
            });
    },
    latestRun: function(_cb) {
        this.listRuns(function(err, files) {
            files = files.map(function(f) {
                return path.parse(f);
            });
            var maxFile = _.max(files, function(f) {
                return f.name;
            });
            var latestRun = maxFile.dir + '/' + maxFile.base;
            _cb(err, latestRun);
        });
    },
    latestRunData: function(_cb) {
        this.latestRun(function(err, file) {
            _cb(err, JSON.parse(fs.readFileSync(file)));
        });
    },
};