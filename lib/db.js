'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');
const Config = require('getconfig');

// Var Declaration ==============================
const internals = {};

// Mpongoose Connection =========================
Mongoose.connect(`mongodb://${Config.database.mongodb.host}/${Config.database.mongodb.db}`);
internals.db = Mongoose.connection;
internals.db.on('error', console.error.bind(console, 'Connection Error!'));
internals.db.on('open', () => {

    console.log('Connection with database succeeded.');
});

// Exposing =====================================
module.exports = {
    Mongoose: Mongoose,
    db: internals.db
};
