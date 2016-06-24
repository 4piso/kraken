'use strict';

// load modules =========================
const Mongoose = require('mongoose');
const Crypto = require('crypto');
const Schema = Mongoose.Schema;

// var declarations ======================
const internals = {};

// model =================================
internals.VendorSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    address: { type: String, required: true },
    reviews: { type: Number, default:0 },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transactions' }]
});

// encriptes pass for the salt column
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

internals.vendor = Mongoose.model('vendor', internals.VendorSchema);

// exposing module ======================
module.exports = {
    Vendor: internals.vendor,
    encryptPass: internals.encryptPass
};
