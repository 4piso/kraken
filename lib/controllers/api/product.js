'use strict';

// Load Modules =================================
    const Boom = require('boom');
    const JSend = require('jsend');
    const Joi = require('joi');
    const AbstractCTRL = require('./abstract');

// Internals ====================================
    const internals = {
        collection: 'product'
    };

// Class Instantiation ==========================
    class ProductCTRL extends AbstractCTRL { }
    const inst = new ProductCTRL(internals.collection);

// Create =======================================
    internals.create = {
        validate: {
            payload: {
                service_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
                name: Joi.string().required().max(50).trim(),
                discount: Joi.number().min(0).max(100).default(0),
                requires: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
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
                service_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                name: Joi.string().required().max(50).trim(),
                discount: Joi.number().min(0).max(100),
                requires: Joi.array()
            }
        },
        handler: inst.update.bind(inst)
    };

// Delete =======================================
    internals.delete = inst.genericConfig.delete;

// Exposing =====================================
    module.exports = internals;
