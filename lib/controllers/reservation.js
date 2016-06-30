'use strict';

// Load Modules =================================
const Joi = require('joi');
const BaseCTRL = require('./base');

// Internals ====================================
const internals = {
    collection: 'reservation'
};

// Class Instantiation ==========================
class ReservationCTRL extends BaseCTRL { };
const inst = new ReservationCTRL(internals.collection);

// Create =======================================
internals.create = {
    validate: {
        payload: {
            service_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            user_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            vendor_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            products: Joi.array().required().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
            latitude: Joi.number().required().min(-90).max(90),
            longitude: Joi.number().required().min(-180).max(180),
            reservation_datetime: Joi.date().timestamp().required(),
            comments: Joi.string(),
            status: Joi.string().required()
        }
    },
    handler: inst.create.bind(inst)
};


// Read =========================================
internals.read = inst.genericConfig.read;

// Exposing =====================================
module.exports = internals;
