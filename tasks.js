var config = require('./config'),
    dir = require('node-dir'),
    fs = require('fs');


module.exports = {
    listRuns: function(_cb) {
        dir.readFiles(config.runsDirectory, {
                match: /.json$/,
                exclude: /^\./
            }, function(err, content, next) {
                if (err) throw err;
                //    console.log('content:', content);
                next();
            },
            function(err, files) {
                if (err) throw err;
                _cb(err, files);
            });
    },

};
