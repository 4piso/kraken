'use strict';

// Load Modules =================================
const Joi = require('joi');
const AbstractCTRL = require('./abstract');

// Internals ====================================
const internals = {
    collection: 'team'
};

// Class Instantiation ==========================
class TeamCTRL extends AbstractCTRL { };
const inst = new TeamCTRL(internals.collection);

// Create =======================================
internals.create = {
    validate: {
        payload: {
            name: Joi.string().required().max(50).trim(),
            users: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
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
            name: Joi.string().max(50).trim(),
            users: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        }
    },
    handler: inst.update.bind(inst)
};

// Delete =======================================
internals.delete = inst.genericConfig.delete;

// Exposing =====================================
module.exports = internals;
