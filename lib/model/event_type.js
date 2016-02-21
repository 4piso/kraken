'use strict';

// Load Modules =================================
	const Mongoose = require('mongoose');

// Var Declaration ==============================
	const internals = {};

// Model ========================================
	internals.EventTypeSchema = new Mongoose.Schema({
		name: { type: String, required: true },
		date_created: { type: Date, default: Date.now }
	});
	internals.eventType = Mongoose.model('eventType', internals.EventTypeSchema);

// Exposing Model ===============================
	module.exports = {
		EventType: internals.eventType
	};
