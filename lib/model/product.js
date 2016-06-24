'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// Var Declaration ==============================
const internals = {};

// Model ========================================
internals.ProductSchema = new Schema({
    service_id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    discount: { type: Number },
    price: { type: Number },
    review: { type: Number},
    comment: { type: String },
    business_info: { type: String},
    requires: { type: [this]  },
    images: [{ type: String }],
    date_created: { type: Date, default: Date.now }
});
internals.product = Mongoose.model('product', internals.ProductSchema);

// Exposing Model ===============================
module.exports = {
    Product: internals.product
};
