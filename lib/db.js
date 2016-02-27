'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');
const Config = require('getconfig');

// Var Declaration ==============================
const internals = {
    closeConn: () => {

        internals.db.close(() => {

            process.exit(0);
        });
    }
};

// Mpongoose Connection =========================
Mongoose.connect(`mongodb://${Config.database.mongodb.host}/${Config.database.mongodb.db}`);
internals.db = Mongoose.connection;
internals.db.on('error', () => {

    console.log('Connection with database succeeded.');
    internals.closeConn();
});
internals.db.on('open', () => {

    console.log('Connection with database succeeded.');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {

    console.log('Mongoose disconnected on app termination');
    internals.closeConn();
});

// Exposing =====================================
module.exports = {
    Mongoose: Mongoose,
    db: internals.db
};
