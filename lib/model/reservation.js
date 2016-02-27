'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// Var Declaration ==============================
const internals = {};

// Model ========================================
internals.ReservationSchema = new Schema({
    service_id: { type: Schema.Types.ObjectId, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    vendor_id: { type: Schema.Types.ObjectId, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    latitude: { type: Number, min: -90, max: 90, required: true },
    longitude: { type: Number, min: -180, max: 180, required: true },
    comments: { type: String },
    status: { type: String }, // Confirmed, Cancelled, Pending, Started, Done
    date_created: { type: Date, default: Date.now }
});
internals.reservation = Mongoose.model('reservation', internals.ReservationSchema);

// Exposing Model ===============================
module.exports = {
    Reservation: internals.reservation
};
