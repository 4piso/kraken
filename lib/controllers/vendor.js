'use strict';

// load modules ==============================
const Joi = require('joi');
const BaseCTRL = require('./base');
const Boom = require('boom');
const JSend = require('jsend');
const Auth = require('../auth');

// Internals ==================================
const internals = {
    collection: 'vendor',
    column: 'products'
};

// class instantiations =======================
class VendorCTRL extends BaseCTRL {
    constructor(collection, column){
        super(collection);
        this.column = column
    }
    create(request, reply){

        // global constant
        const pswdObj = this.model.encryptPass(request.payload.password);
        const payload = Object.assign({}, request.payload, pswdObj);
        const vendor = new this.Collection(payload);

        // save the vendor to the schema
        vendor.save((err, _vendor) => {

            if (!err) {
                return reply(JSend.success(_vendor));
            }

            if (err.code === 11000 || err.code === 11001) {
                return reply(Boom.forbidden('Please provide another vendor id, it already exist'))
            }

            return reply(Boom.forbidden(err));
        });
    };

    readVendor(request, reply){

        // global constants
        const products = request.params._id || null;
        const query = (products) ? { products: products } : {};

        this.Collection.find(query, (err, docs) =>  {

            if (err) {
                reply(Boom.badImplementation(err));
            }

            if (!docs.length) {
                reply(Boom.notFound('Record not found'));

            } else {

                reply(JSend.success(docs));
            }

        })

    };
};

const inst = new VendorCTRL(internals.collection);

// create and validate ========================
internals.create = {
    validate: {
        payload: {
            fname: Joi.string().required(),
            lname: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
            address: Joi.string().required(),
            reviews: Joi.number(),
            products: Joi.array().required().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
            transactions: Joi.array().required().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        }
    },
    handler: inst.create.bind(inst)
};

// Read ========================================
internals.read = inst.genericConfig.read;

// read vendor service to pull data passing the product Id
internals.readVendor = {
    handler: inst.readVendor.bind(inst)
}

// exposing ====================================
module.exports = internals;
