'use strict';

// Load Modules =================================
const Joi = require('joi');
const Boom = require('boom');
const JSend = require('jsend');
const BaseCTRL = require('./base');
const Auth = require('../../auth');

// Internals ====================================
const internals = {
    collection: 'user'
};

// Class Instantiation ==========================
class UserCTRL extends BaseCTRL {
    create(request, reply) {

        const pswdObj = this.model.encryptPass(request.payload.password);
        const payload = Object.assign({}, request.payload, pswdObj);
        const user = new this.Collection(payload);

        user.save((err, _user) => {

            if (!err) {
                reply(JSend.success(_user)); // HTTP 201
            }
            else {
                if (err.code === 11000 || err.code === 11001) {
                    reply(Boom.forbidden('Please provide another user id, it already exist'));
                }
                else {
                    reply(Boom.forbidden(err)); // HTTP 403
                }
            }
        });
    }

    bellFB(request, reply) {

        if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
        }

        const auth = new Auth();
        const temp = request.auth.credentials;
        const facebook = temp.profile.raw;

        this.Collection.findOne({ email: facebook.email }, (err, user) => {

            if (err) {
                throw Error(err);
            }

            facebook.token = temp.token;
            facebook.tokenExpiresIn = temp.expiresIn;

            user.facebook = facebook;
            user.jwt = auth.createToken(request, { user_id: user._id });
            user.save((_err, _user) => {

                if (_err) {
                    reply(Boom.forbidden(err)); // HTTP 403
                }
                else {
                    reply(JSend.success(_user)); // HTTP 201
                }
            });
        });

        // reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
    }
}
const inst = new UserCTRL(internals.collection);

// Create =======================================
internals.create = {
    validate: {
        payload: {
            fname: Joi.string().required().max(50).trim(),
            lname: Joi.string().required().max(50).trim(),
            email: Joi.string().required().email().max(255).lowercase().trim(),
            password: Joi.string().required().min(6).max(128),
            is_vendor: Joi.boolean(),
            rating: Joi.number().default(0),
            active: Joi.boolean().default(true),
            team_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    },
    handler: inst.create.bind(inst)
};

// Read =========================================
internals.read = inst.genericConfig.read;

// Update =======================================
internals.update = {
    validate: {
        payload: {
            _id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            fname: Joi.string().max(50).trim(),
            lname: Joi.string().max(50).trim(),
            email: Joi.string().email().max(255).lowercase().trim(),
            password: Joi.string().min(6).max(128),
            is_vendor: Joi.boolean(),
            rating: Joi.number().default(0),
            active: Joi.boolean().default(true),
            team_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }
    },
    handler: inst.update.bind(inst)
};

// Delete =======================================
internals.delete = inst.genericConfig.delete;

// Authenticate with FB =========================
internals.bellFB = {
    auth: {
        strategy: 'facebook',
        mode: 'try'
    },
    handler: inst.bellFB.bind(inst)
};

// Exposing =====================================
module.exports = internals;
