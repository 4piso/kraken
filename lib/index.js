'use strict';

// Load Modules ==============================
    const Glue = require('glue');
    const Db = require('./db');
    const Config = require('getconfig');

// Var Declaration ==============================
    const internals = {
        options: { relativeTo: __dirname }
    };

// Glue =========================================
    Glue.compose(Config.manifest, internals.options, (err, server) => {

        if (err) {
            console.log('server.register err:', err);
        }

        server.start(() => {

            console.log(`✅  Hapi Days!`);
        });
    });
