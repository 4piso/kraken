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
    email: { type: String, required: true, unique: true, lowercase: true, maxlength: 255, trim: true },
    password: { type: String, minlength: 6, maxlength: 128 },
    salt: { type: String },
    is_vendor: { type: Boolean },
    rating: { type: Number },
    active: { type: Boolean, default: true },
    facebook: Schema.Types.Mixed,
    jwt: {
        token: { type: String },
        exp: { type: Number }
    },
    last_login: { type: Date, default: Date.now },
    date_created: { type: Date, default: Date.now }
});
internals.encryptPass = (pswd, salt) => {

    salt = salt || Crypto.randomBytes(14).toString('hex');
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
