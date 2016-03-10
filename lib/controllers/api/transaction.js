'use strict';

// Load Modules =================================
const Joi = require('joi');
const BaseCTRL = require('./base');

// Internals ====================================
const internals = {
    collection: 'transaction'
};

// Class Instantiation ==========================
class TransactionCTRL extends BaseCTRL { };
const inst = new TransactionCTRL(internals.collection);

// Create =======================================
internals.create = {
    validate: {
        payload: {
            user_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            card_number: Joi.number(),
            payment_method: Joi.string().required(),
            card_type: Joi.string(),
            authorization_code: Joi.string(),
            amount: Joi.number().precision(2).required(),
            currency: Joi.string().required(),
            status: Joi.string().required(),
            details: Joi.string()
        }
    },
    handler: inst.create.bind(inst)
};

// Read =========================================
internals.read = inst.genericConfig.read;

// Exposing =====================================
module.exports = internals;
