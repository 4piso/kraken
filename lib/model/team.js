'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');

// Var Declaration ==============================
const internals = {};

// Model ========================================
internals.TeamSchema = new Mongoose.Schema({
    users: [],
    date_created: { type: Date, default: Date.now }
});
internals.team = Mongoose.model('team', internals.TeamSchema);

// Exposing Model ===============================
module.exports = {
    Team: internals.team
};
