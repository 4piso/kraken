'use strict';

// Load Modules =================================
const Joi = require('joi');
const BaseCTRL = require('./base');

// Internals ====================================
const internals = {
    collection: 'service'
};

// Class Instantiation ==========================
class ServiceCTRL extends BaseCTRL { };
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
internals.read = inst.genericConfig.read;

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
internals.delete = inst.genericConfig.delete;

// Exposing =====================================
module.exports = internals;
