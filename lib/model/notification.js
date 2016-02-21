'use strict';

// Load Modules =================================
	const Mongoose = require('mongoose');

// Var Declaration ==============================
	const internals = {};

// Model ========================================
	internals.NotificationSchema = new Mongoose.Schema({
		name: { type: String, required: true },
		date_created: { type: Date, default: Date.now }
	});
	internals.notification = Mongoose.model('notification', internals.NotificationSchema);

// Exposing Model ===============================
	module.exports = {
		Notification: internals.notification
	};
