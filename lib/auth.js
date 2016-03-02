'use strict';

// Load Modules =================================
const JWT = require('jsonwebtoken');
const Config = require('getconfig');
const UserModel = require('./model/User');

// ==
class Auth {
    constructor() { }

    createToken(req, opts) {

        opts = opts || {};

        if (!('user_id' in opts)) {
            // show error
        }

        // By default, expire the token after 7 days.
        const expiresDefault = Math.floor(new Date().getTime()/1000) + 7*24*60*60;
        const JWTopts = {
            user_id: opts.user_id,
            agent: req.headers['user-agent'],
            exp:   opts.expires || expiresDefault
        };
        const token = JWT.sign(JWTopts, Config.secret);

        return token;
    }

    validateToken(decoded, request, callback) {

        UserModel.User.findOne({ _id: decoded.user_id }, (err, user) => {

            if (!err) {
                // guardarlo en session o algo
                callback(null, true);
            } else {
                return callback(null, false);
            }
        });
    }
};

// Exposing =====================================
module.exports = Auth;