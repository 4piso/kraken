'use strict';

// Load Modules =================================
const Joi = require('joi');
const BaseCTRL = require('./base');
const AWS = require('aws-sdk');
const Crypto = require('crypto');
const Fs = require('fs');
const Config = require('getconfig');

// Internals ====================================
const internals = {
    collection: 'media',
    randomByte: () => {
        return Crypto.randomBytes(1)[0] & 0x30;
    }
};

// Class Instantiation ==========================
class MediaCTRL extends BaseCTRL {
    constructor(collection) {

        super(collection);
        this.s3 = new AWS.S3({
            accessKeyId: Config.s3.keyId,
            secretAccessKey: Config.s3.secretKey,
            params: {
                Bucket: Config.s3.bucket
            }
        });
    }

    create(request, reply) {

        const data = request.payload;
        const self = this;
        const start = new Date();

        if (data.file) {
            const filename = "crypto.randomBytes";
            const name = data.file.hapi.filename;
            const path = request.server.app.rootPath + "/tmp/" + name;
            const file = Fs.createWriteStream(path);

            file.on('error', (err) => {
                console.error(err);
            });

            data.file.pipe(file);

            data.file.on('end', (err) => {

                const stats = Fs.statSync(path);
                const thisfile = Fs.createReadStream(path);
                const params = {
                    Key: `media/${name}`, // create unique filename
                    Body: thisfile,
                    ContentLength: stats["size"],
                    ContentType: request.headers['content-type']
                };

                self.s3.putObject(params)
                .on('httpUploadProgress', (progress, response) => {
                    console.log('progress');
                    console.log(progress);
                })
                .on('error', (error, response) => {
                    console.log('error');
                    console.log(error);
                })
                .on('success', (response) => {
                    console.log('success');
                    console.log(response);
                    response.elapse = new Date() - start;
                    let cache = [];
                    let result = JSON.stringify(response, function(key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Circular reference found, discard key
                                return;
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                    cache = null;
                    reply(result);
                })
                .send();
            });
        }
    }
};
const inst = new MediaCTRL(internals.collection);

// Create =======================================
internals.create = {
    validate: {
        payload: {
            file: Joi.any(),
            name: Joi.string().required().trim(),
            path: Joi.string().trim(),
            tags: Joi.array().items(Joi.string()),
            context: Joi.object().keys({
                description: Joi.string(),
                caption: Joi.string()
            })
        }
    },
    payload: {
        output: 'stream',
        parse: true,
        maxBytes: 10485760,
        allow: 'multipart/form-data'
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
            name: Joi.string().required().trim(),
            path: Joi.string().trim(),
            tags: Joi.array().items(Joi.string()),
            context: Joi.object().keys({
                description: Joi.string(),
                caption: Joi.string()
            })
        }
    },
    handler: inst.update.bind(inst)
};

// Delete =======================================
internals.delete = inst.genericConfig.delete;

// Exposing =====================================
module.exports = internals;
