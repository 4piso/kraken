'use strict';

// Load Modules =================================
const Controllers = require('./controllers');

// Exposing Routes ==============================
exports.register = (plugin, options, next) => {

    //== Routes
    plugin.route([
        // User
        { method: 'POST', path: '/user/', config: Controllers.User.create },
        { method: 'GET', path: '/user/{_id?}', config: Controllers.User.read },
        { method: 'PUT', path: '/user/', config: Controllers.User.update },
        { method: 'DELETE', path: '/user/{_id}', config: Controllers.User.delete },

        // Service
        { method: 'POST', path: '/service/', config: Controllers.Service.create },
        { method: 'GET', path: '/service/{_id?}', config: Controllers.Service.read },
        { method: 'PUT', path: '/service/', config: Controllers.Service.update },
        { method: 'DELETE', path: '/service/{_id}', config: Controllers.Service.delete },

        // Product
        { method: 'POST', path: '/product/', config: Controllers.Product.create },
        { method: 'GET', path: '/product/{_id?}', config: Controllers.Product.read },
        { method: 'PUT', path: '/product/', config: Controllers.Product.update },
        { method: 'DELETE', path: '/product/{_id}', config: Controllers.Product.delete }
    ]);

    //== Move Along
    next();
};
exports.register.attributes = {
    name: 'routes',
    version: require('../package.json').version
};
