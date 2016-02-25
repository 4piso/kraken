'use strict';

// Load Modules =================================
    const Boom = require('boom');
    const JSend = require('jsend');
    const Joi = require('joi');
    const AbstractCTRL = require('./abstract');

// Internals ====================================
    const internals = {
        collection: 'service'
    };

// Class Instantiation ==========================
    class ServiceCTRL extends AbstractCTRL {
        update (request, reply) {

            this.Collection.findOne({
                _id: request.payload._id
            }, (err, doc) => {

                if (!err) {
                    doc.name = request.payload.name;
                    doc.save((err, doc) => {

                        if (!err) {
                            reply(JSend.success(doc)); // HTTP 201
                        } else {
                            reply(Boom.forbidden(err)); // HTTP 403
                        }
                    });
                } else {
                    reply(Boom.badImplementation(err)); // 500 error
                }
            });
        }
    }
    const inst = new ServiceCTRL(internals.collection);

// Create =======================================
    internals.create = {
        validate: {
            payload: {
                name: Joi.string().required().max(50).trim()
            }
        },
        handler: inst.create.bind(inst)
    };

// Read =========================================
    internals.read = {
        validate: {
            params: {
                _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
            }
        },
        handler: inst.read.bind(inst)
    };

// Update =======================================
    internals.update = {
        validate: {
            payload: {
                _id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
                name: Joi.string().max(50).trim()
            }
        },
        handler: inst.update.bind(inst)
    };

// Delete =======================================
    internals.delete = {
        validate: {
            params: {
                _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
            }
        },
        handler: inst.delete.bind(inst)
    };

// Exposing =====================================
    module.exports = internals;
