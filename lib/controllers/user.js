'use strict';

// Load Modules =================================
const Joi = require('joi');
const Boom = require('boom');
const Hoek = require('hoek');
const JSend = require('jsend');
const BaseCTRL = require('./base');
const Auth = require('../auth');
const UserModel = require('../model/user');
const UserCollection = UserModel.User;

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
        this.save(request, reply, user);
    }

    save(request, reply, user) {
        user.save((err, _user) => {

            if (!err) {
                return reply(JSend.success(_user)); // HTTP 201
            }
            else {
                if (err.code === 11000 || err.code === 11001) {
                    return reply(Boom.forbidden('Please provide another user id, it already exist'));
                }
                else {
                    return reply(Boom.forbidden(err)); // HTTP 403
                }
            }
        });
    }

    login(request, reply) {

        const self = this;
        const payload = request.payload;
        const auth = new Auth();
        let query;

        const replyJWT = (user) => {

            // Create JWT
            user.jwt = auth.createToken(request, { 'user_id': user._id });
            user.save((err, _user) => {

                if (!err) {
                    return reply(JSend.success(_user)); // HTTP 201
                }
                else {
                    return reply(Boom.forbidden(err)); // HTTP 403
                }
            });
        };

        // Auth Data (FB or simple)
        if ("password" in payload) {
            // Check if user is in DB
            UserCollection.findOne({ "email": payload.email }, (err, user) => {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                if (!user) {
                    return reply(Boom.notFound('Record not found'));
                }

                // Check if password is valid
                if (UserModel.encryptPass(payload.password, user.salt).password === user.password) {
                    replyJWT(user);
                } else {
                    // Invalid password
                    return reply(Boom.unauthorized('Incorrect password'));
                }
            });
        }
        else if ("fbtoken" in payload) {
            // Check if user is in DB
            UserCollection.findOne({ "facebook.token": payload.fbtoken }, (err, user) => {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                if (!user) {
                    // If not, create it
                    // TODO: validations for the Create user
                    return Joi.validate(payload, internals.create.validate, (err, value) => {

                        const user = new self.Collection(payload);
                        self.save(request, reply, user);
                    });
                }

                replyJWT(user);
            });
        }
        else {
            return reply(Boom.unauthorized('Incorrect email or password.'));
        }
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

// Authenticate =================================
internals.login = {
    auth: false,
    validate: {
        payload: {
            email: Joi.string().required().email().max(255).lowercase().trim(),
            fname: Joi.string().max(50).trim(),
            lname: Joi.string().max(50).trim(),
            password: Joi.string().min(6).max(128),
            fbtoken: Joi.string()
        }
    },
    handler: inst.login.bind(inst)
};

// Exposing =====================================
module.exports = internals;
