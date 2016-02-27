'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// Var Declaration ==============================
const internals = {};

// Model ========================================
internals.TeamSchema = new Schema({
	name: { type: String, required: true },
    users: [Schema.Types.ObjectId],
    date_created: { type: Date, default: Date.now }
});
internals.team = Mongoose.model('team', internals.TeamSchema);

// Exposing Model ===============================
module.exports = {
    Team: internals.team
};
