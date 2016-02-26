'use strict';

// Load Modules =================================
const Boom = require('boom');
const JSend = require('jsend');
const Joi = require('joi');

// Internals ====================================
const internals = {
    model: null
};

// Class Abstract for CRUD ======================
class AbstractCTRL {
    constructor(collection) {

        this.collectionName = collection.charAt(0).toUpperCase() + collection.substr(1).toLowerCase();
        this.model = require(`../../model/${collection}`);
        this.Collection = this.model[this.collectionName];

        // Generic CRUD method config
        this.genericConfig = {
            read: {
                validate: {
                    params: {
                        _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
                    }
                },
                handler: this.read
            },
            delete: {
                validate: {
                    params: {
                        _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
                    }
                },
                handler: this.delete
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
        const callback = (err, docs) => {

            if (err) {
                reply(Boom.badImplementation(err));
            }
            else if (!docs.length) {
                reply(Boom.notFound('Record not found'));
            }
            else {
                reply(JSend.success(docs));
            }
        };
        const query = (_id) ? { _id: _id } : {};

        this.Collection.find(query).exec(callback);
    }

    update(request, reply) {

        this.Collection.findOne({
            _id: request.payload._id
        }, (err, doc) => {

            if (!err) {
                delete request.payload._id;
                doc._doc = Object.assign({}, doc._doc, request.payload);
                doc.save((err, _doc) => {

                    if (!err) {
                        reply(JSend.success(_doc)); // HTTP 201
                    }
                    else {
                        reply(Boom.forbidden(err)); // HTTP 403
                    }
                });
            }
            else {
                reply(Boom.badImplementation(err)); // 500 error
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
module.exports = AbstractCTRL;
