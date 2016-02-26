'use strict';

// Load Modules =================================
const Joi = require('joi');
const AbstractCTRL = require('./abstract');

// Internals ====================================
const internals = {
    collection: 'service'
};

// Class Instantiation ==========================
class ServiceCTRL extends AbstractCTRL { };
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
