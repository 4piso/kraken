'use strict';

// Load Modules =================================
const Joi = require('joi');
const BaseCTRL = require('./base');
const JSend = require('jsend');
const Boom = require('boom');

// Internals ====================================
const internals = {
    collection: 'product',
    column: 'service_id'
};

// Class Instantiation ==========================
class ProductCTRL extends BaseCTRL {
    constructor(collection, column){
        super(collection)
        this.column = column;
    }

    readService(request, reply){

        // constant properties
        const service_id = request.params._id || null;
        const query = (service_id) ? { service_id : service_id } : {};

        this.Collection.find(query,(err, docs) => {
            if (err) {
                reply(Boom.badImplementation(err));
            }

            if (!docs.length) {
                reply(Boom.notFound('Record not found'));
            }
            else {
                reply(JSend.success(docs));
            }
        });
    }
}

const inst = new ProductCTRL(internals.collection, internals.column);

// Create =======================================
internals.create = {
    validate: {
        payload: {
            service_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            name: Joi.string().required().max(50).trim(),
            description: Joi.string().required().trim(),
            discount: Joi.number().min(0).max(100).default(0),
            price: Joi.number().min(0),
            comment: Joi.string().required().trim(),
            review: Joi.number().min(0).max(100).default(0),
            business_info: Joi.string().required().trim(),
            images: Joi.array().items(Joi.string()),
            requires: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        }
    },
    handler: inst.create.bind(inst)
};

// Read =========================================
internals.read = inst.genericConfig.read;

// Read Product by services_id ==================
internals.readService = {
    handler: inst.readService.bind(inst)
}

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
