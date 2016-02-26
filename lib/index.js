'use strict';

// Load Modules =================================
const Glue = require('glue');
const Hoek = require('hoek');

// Declare internals ============================
const internals = {};

// Glue =========================================
exports.init = (manifest, options, next) => {

    Glue.compose(manifest, options, (err, server) => {

        Hoek.assert(!err, err);

        server.start((err) => {

            // console.log(`✅  Hapi Days!`);
            return next(err, server);
        });
    });
};
