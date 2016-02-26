'use strict';

// Load Modules =================================
const Joi = require('joi');
const Boom = require('boom');
const JSend = require('jsend');
const AbstractCTRL = require('./abstract');

// Internals ====================================
const internals = {
    collection: 'user'
};

// Class Instantiation ==========================
class UserCTRL extends AbstractCTRL {
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

// Exposing =====================================
module.exports = internals;
