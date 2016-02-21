'use strict';

// TODO: Unify Boom and JSend

// Load Modules =================================
    const Joi = require('joi');
    const Boom = require('boom');
    const JSend = require('jsend');
    const UserModel = require('../../model/user');
    const User = UserModel.User;

// Internals ====================================
    const internals = {};

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
        handler: (request, reply) => {

            let pswdObj = UserModel.encryptPass(request.payload.password);
            let payload = Object.assign({}, request.payload, pswdObj);
            let user;

            user = new User(payload);

            user.save((err, user) => {
                if (!err) {
                    reply(JSend.success(user)); // HTTP 201
                } else {
                    if (11000 === err.code || 11001 === err.code) {
                        reply(Boom.forbidden("Please provide another user id, it already exist"));
                    }
                    else {
                        reply(Boom.forbidden(err)); // HTTP 403
                    }
                }
            });
        }
    };

// Read =========================================

// Update =======================================

// Delete =======================================

// Exposing =====================================
    module.exports = internals;
