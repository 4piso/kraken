'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// Var Declaration ==============================
const internals = {};

// Model ========================================
internals.MediaSchema = new Schema({
    name: { type: String, required: true },
    path: { type: String },
    bytes: { type: Number },
    type: { type: String, required: true },
    tags: [{ type: String }],
    context: {
        description: { type: String },
        caption: { type: String }
    },
    url: { type: String, required: true },
    date_created: { type: Date, default: Date.now }
});
internals.media = Mongoose.model('media', internals.MediaSchema);

// Exposing Model ===============================
module.exports = {
    Media: internals.media
};
