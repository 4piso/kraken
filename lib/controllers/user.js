'use strict';

// Load Modules =================================
const Joi = require('joi');
const Boom = require('boom');
const JSend = require('jsend');
const BaseCTRL = require('./base');
const Auth = require('../auth');

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
                return reply(JSend.success(_user)); // HTTP 201
            }

            if (err.code === 11000 || err.code === 11001) {
                return reply(Boom.forbidden('Please provide another user id, it already exist'));
            }

            return reply(Boom.forbidden(err)); // HTTP 403
        });
    }

    login(request, reply) {

        const self = this;
        const payload = request.payload;
        const auth = new Auth();
        const query = { 'email': payload.email };
        let _user;

        // Auth Data (FB or simple)
        if ('facebook' in payload && 'id' in payload.facebook) {
            query['facebook.id'] = payload.facebook.id;
        }

        // Check if user is in DB
        self.Collection.findOne(query, (err, user) => {

            if (err) {
                return reply(Boom.badImplementation(err));
            }

            if (!user && !('facebook' in payload)) {
                // User not found for simple strategy
                return reply(Boom.notFound('Record not found'));
            }
            else if (!user && ('facebook' in payload)) {
                // User not found but comes from FB validation, create it.
                // First we will validate if the necesary data comes
                const fb = payload.facebook;
                const userVal = {
                    fname: fb.first_name,
                    lname: fb.last_name,
                    email: fb.email,
                    facebook: fb
                };
                const schema = internals.create.validate.payload;
                schema.password = Joi.string();
                Joi.validate(userVal, schema, (_err, value) => {

                    if (_err) {
                        return reply(Boom.badImplementation(_err));
                    }

                    _user = new self.Collection(userVal);
                });
            }
            else if ('password' in payload){
                // Check if passwords doesnt match
                if (self.model.encryptPass(payload.password, user.salt).password !== user.password) {
                    return reply(Boom.unauthorized('Incorrect password.'));
                }
                else {
                    // Matched password!
                    _user = user;
                }
            }
            else {
                return reply(Boom.unauthorized('Incorrect authentication parameters.'));
            }

            if (_user.jwt.token) {
                if (_user.jwt.exp <= (new Date().getTime() / 1000)) {
                    return reply(JSend.success(_user)); // HTTP 201
                }
            }

            // Create JWT, save it to mongo, and reply
            _user.jwt = auth.createToken(request, { 'user_id': _user._id });
            _user.save((err, resultUser) => {

                if (!err) {
                    const result = {
                        email: resultUser.email,
                        fname: resultUser.fname,
                        lname: resultUser.lname,
                        jwt: resultUser.jwt,
                        facebook: resultUser.facebook,
                        rating: resultUser.rating,
                        active: resultUser.active
                    };
                    return reply(JSend.success(result)); // HTTP 201
                }

                return reply(Boom.forbidden(err)); // HTTP 403
            });
        });
    }

    emailCheck(request, reply) {

        const query = { email: request.payload.email };

        this.Collection.find(query, (err, docs) => {

            if (err) {
                return reply(Boom.badImplementation(err));
            }

            if (!docs.length) {
                return reply(JSend.success({ userFound: false }));
            }

            return reply(JSend.success({ userFound: true }));
        });
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
            team_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            facebook: {
                id: Joi.string(),
                email: Joi.string().required().email().max(255).lowercase().trim(),
                first_name: Joi.string(),
                last_name: Joi.string(),
                gender: Joi.string(),
                link: Joi.string().uri(),
                token: Joi.string(),
                tokenExpiresIn: Joi.number()
            }
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
            password: Joi.string().min(6).max(128),
            facebook: {
                id: Joi.string(),
                email: Joi.string().required().email().max(255).lowercase().trim(),
                first_name: Joi.string(),
                last_name: Joi.string(),
                gender: Joi.string(),
                link: Joi.string().uri(),
                token: Joi.string(),
                tokenExpiresIn: Joi.number()
            }
        }
    },
    handler: inst.login.bind(inst)
};

// Check if email is in DB ======================
internals.emailCheck = {
    validate: {
        payload: {
            email: Joi.string().required().email().max(255).lowercase().trim()
        }
    },
    handler: inst.emailCheck.bind(inst)
};

// Exposing =====================================
module.exports = internals;
