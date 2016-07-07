'use strict';

// Load Modules =================================
const Joi = require('joi');
const BaseCTRL = require('./base');
const JSend = require('jsend');
const Boom = require('boom');

// Internals ====================================
const internals = {
    collection: 'reservation'
};

// Class Instantiation ==========================
class ReservationCTRL extends BaseCTRL {

    constructor(collection, column){

        super(collection)
        this.column = column
    }
    // this method is waiting for a date and return the query result with all reservations available for that time
    searchByDate(request, reply){

        // global constan
        const reservations = request.params._datetime || null;
        const query = (reservations) ? { reservation_datetime : reservations } : {};

        this.Collection.find(query, (err, docs) => {

            if (err) {

                reply(Boom.badImplementation(err));

            };

            if (!docs.length) {

                reply(Boom.notFound('Record not found'))
            } else {

                reply(JSend.success(docs));
            }

        });


    }
};
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
            reservation_datetime: Joi.date().required(),
            comments: Joi.string(),
            status: Joi.string().required()
        }
    },
    handler: inst.create.bind(inst)
};


// Read =========================================
internals.read = inst.genericConfig.read;

// search by date ==============================
internals.searchByDate = {

    handler: inst.searchByDate.bind(inst)
}


// Exposing =====================================
module.exports = internals;
