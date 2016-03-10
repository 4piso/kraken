'use strict';

// Load Modules =================================
const Glue = require('glue');
const Hoek = require('hoek');

// Glue =========================================
exports.init = (manifest, options, next) => {

    Glue.compose(manifest, options, (err, server) => {

        Hoek.assert(!err, err);

        server.start((err) => {

            return next(err, server);
        });
    });
};
