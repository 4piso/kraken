'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// Var Declaration ==============================
const internals = {};

// Model ========================================
internals.TransactionSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true },
    payment_method: { type: String, required: true },
    card_type: { type: String },
    authorization_code: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    details: { type: String },
    date_created: { type: Date, default: Date.now }
});
internals.transaction = Mongoose.model('transaction', internals.TransactionSchema);

// Exposing Model ===============================
module.exports = {
    Transaction: internals.transaction
};
