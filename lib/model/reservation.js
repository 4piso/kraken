'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// Var Declaration ==============================
const internals = {};

// Model ========================================
internals.EventSchema = new Schema({
    event_type_id: { type: Schema.Types.ObjectId, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    vendor_id: { type: Schema.Types.ObjectId, required: true },
    transaction_id: { type: Schema.Types.ObjectId, required: true },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    comments: { type: String },
    status: { type: String },
    date_created: { type: Date, default: Date.now }
});
internals.event = Mongoose.model('event', internals.EventSchema);

// Exposing Model ===============================
module.exports = {
    Event: internals.event
};
