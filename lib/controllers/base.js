'use strict';
/* $lab:coverage:off$ */
// Load Modules =================================
const Boom = require('boom');
const JSend = require('jsend');
const Joi = require('joi');

// Internals ====================================
const internals = {
    model: null
};

// Class Abstract for CRUD ======================
class BaseCRUD {
    constructor(collection) {

        this.collectionName = collection.charAt(0).toUpperCase() + collection.substr(1).toLowerCase();
        this.model = require(`../model/${collection}`);
        this.Collection = this.model[this.collectionName];

        // Generic CRUD method config
        this.genericConfig = {
            read: {
                validate: {
                    params: {
                        _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
                    }
                },
                handler: this.read.bind(this)
            },
            delete: {
                validate: {
                    params: {
                        _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
                    }
                },
                handler: this.delete.bind(this)
            }
        };
    }

    create(request, reply) {

        const newDoc = new this.Collection(request.payload);

        newDoc.save((err, doc) => {

            if (!err) {
                reply(JSend.success(doc)); // HTTP 201
            }
            else {
                if (err.code === 11000 || err.code === 11001) {
                    reply(Boom.forbidden('Please provide another id, it already exist'));
                }
                else {
                    reply(Boom.forbidden(err)); // HTTP 403
                }
            }
        });
    }

    read(request, reply) {


        const _id = request.params._id || null;
        const query = (_id) ? { _id: _id } : {};
        console.log(request.auth);
        this.Collection.find(query, (err, docs) => {

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

    update(request, reply) {

        const conditions = {
            _id: request.payload._id
        };

        delete request.payload._id;
        this.Collection.findOneAndUpdate(conditions, request.payload, (err, _doc) => {

            if (!err) {
                reply(JSend.success(_doc)); // HTTP 201
            }
            else {
                reply(Boom.forbidden(err)); // HTTP 403
            }
        });
    }

    delete(request, reply) {

        this.Collection.findOne({ '_id': request.params._id }, (err, doc) => {

            if (!err && doc) {
                doc.remove();
                reply(JSend.success(`${this.collectionName} deleted successfully`));
            }
            else if (!err) {
                reply(Boom.notFound()); // Couldn't find the object.
            }
            else {
                reply(Boom.badRequest(`Could not delete ${this.collectionName}`));
            }
        });
    }
}

// Exposing =====================================
module.exports = BaseCRUD;
/* $lab:coverage:on$ */
