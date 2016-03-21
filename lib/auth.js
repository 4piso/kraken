'use strict';

// Load Modules =================================
const JWT = require('jsonwebtoken');
const Config = require('getconfig');
const UserModel = require('./model/user');
const UserCollection = UserModel.User;
let self = null; // eslint-disable-line consistent-this

// ==
class Auth {
    constructor() {

        if (!self){
            self = this;
        }

        return self;
    }

    createToken(req, opts) {

        opts = opts || {};

        if (!('user_id' in opts)) {
            // show error
        }

        // By default, expire the token after 7 days.
        const expiresDefault = Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60;
        const JWTopts = {
            user_id: opts.user_id,
            agent: req.headers['user-agent'],
            exp:   opts.expires || expiresDefault
        };
        const token = JWT.sign(JWTopts, Config.secret);

        return { token, exp: JWTopts.exp };
    }

    validateToken(decoded, request, callback) {

        UserCollection.findOne({ _id: decoded.user_id }, (err, user) => {

            if (!err) {
                // guardarlo en session o algo
                return callback(null, true, user);
            }

            return callback(null, false, {});
        });
    }
};

// Exposing =====================================
module.exports = Auth;
