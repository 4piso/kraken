'use strict';

// Load Modules ==============================
const Hoek = require('hoek');
const Config = require('getconfig');
const Server = require('./lib');
require('./lib/db');

// Declare internals ============================
const internals = {
    options: { relativeTo: `${__dirname}/lib` }
};

// Init Servers =================================
Server.init(Config.manifest, internals.options, (err, server) => {

    Hoek.assert(!err, err);

    // Server connections
    const api = server.select('api');
    server.app = {
        rootPath: __dirname
    };

    // Logging started server
    console.log('API server started at: ' + api.info.uri);
});
