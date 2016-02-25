'use strict';

// Load Modules =================================
	const Mongoose = require('mongoose');

// Var Declaration ==============================
	const internals = {};

// Model ========================================
	internals.ServiceSchema = new Mongoose.Schema({
		name: { type: String, required: true },
		date_created: { type: Date, default: Date.now }
	});
	internals.service = Mongoose.model('service', internals.ServiceSchema);

// Exposing Model ===============================
	module.exports = {
		Service: internals.service
	};
