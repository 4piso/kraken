'use strict';

// Load Modules =================================
const Mongoose = require('mongoose');
const Crypto = require('crypto');
const Schema = Mongoose.Schema;

// Var Declaration ==============================
const internals = {};

// Model ========================================
internals.UserSchema = new Schema({
    team_id: { type: Schema.Types.ObjectId },
    fname: { type: String, required: true, maxlength: 50, trim: true },
    lname: { type: String, required: true, maxlength: 50, trim: true },
    email: { type: String, required: true, lowercase: true, maxlength: 255, trim: true },
    password: { type: String, required: true, minlength: 6, maxlength: 128 },
    salt: { type: String, required: true },
    is_vendor: { type: Boolean },
    rating: { type: Number },
    active: { type: Date },
    facebook: Schema.Types.Mixed,
    jwt: { type: String },
    last_login: { type: String, default: Date.now },
    date_created: { type: Date, default: Date.now }
});
internals.encryptPass = (pswd) => {

    const salt = Crypto.randomBytes(14).toString('hex');
    const sha1 = Crypto.createHash('sha1').update(pswd).digest('hex') + salt;
    const password = Crypto.createHash('sha256').update(sha1).digest('hex');
    const result = {
        salt,
        password
    };

    return result;
};
internals.user = Mongoose.model('user', internals.UserSchema);

// Exposing Model ===============================
module.exports = {
    User: internals.user,
    encryptPass: internals.encryptPass
};
