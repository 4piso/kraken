'use strict';

// Load Modules =================================
const Controllers = require('./controllers');
const Config = require('getconfig');
const Auth = require('./auth');

// Exposing Plugin ==============================
exports.register = (plugin, options, next) => {

    const auth = new Auth();

    //== JWT
    plugin.auth.strategy('jwt', 'jwt', {
        key: Config.secret,                         // Never Share your secret key
        validateFunc: auth.validateToken,           // validate function defined above
        verifyOptions: { algorithms: ['HS256'] }    // pick a strong algorithm
    });

    // plugin.auth.default('jwt');

    //== Routes
    plugin.route([
        // User
        { method: 'POST', path: '/user/', config: Controllers.User.create },
        { method: 'GET', path: '/user/{_id?}', config: Controllers.User.read },
        { method: 'PUT', path: '/user/', config: Controllers.User.update },
        { method: 'DELETE', path: '/user/{_id}', config: Controllers.User.delete },
        { method: 'POST', path: '/user/login/', config: Controllers.User.login }, // No Auth
        { method: 'POST', path: '/user/email-check/', config: Controllers.User.emailCheck },

        // Team
        { method: 'POST', path: '/team/', config: Controllers.Team.create },
        { method: 'GET', path: '/team/{_id?}', config: Controllers.Team.read },
        { method: 'PUT', path: '/team/', config: Controllers.Team.update },
        { method: 'DELETE', path: '/team/{_id}', config: Controllers.Team.delete },

        // Service
        { method: 'POST', path: '/service/', config: Controllers.Service.create },
        { method: 'GET', path: '/service/{_id?}', config: Controllers.Service.read },
        { method: 'PUT', path: '/service/', config: Controllers.Service.update },
        { method: 'DELETE', path: '/service/{_id}', config: Controllers.Service.delete },

        // Product
        { method: 'POST', path: '/product/', config: Controllers.Product.create },
        { method: 'GET', path: '/product/{_id?}', config: Controllers.Product.read },
        { method: 'GET', path: '/product/service/{_id?}', config: Controllers.Product.readService },
        { method: 'PUT', path: '/product/', config: Controllers.Product.update },
        { method: 'DELETE', path: '/product/{_id}', config: Controllers.Product.delete },

        // Transaction
        { method: 'POST', path: '/transaction/', config: Controllers.Transaction.create },
        { method: 'GET', path: '/transaction/{_id?}', config: Controllers.Transaction.read },

        // Reservation
        { method: 'POST', path: '/reservation/', config: Controllers.Reservation.create },
        { method: 'GET', path: '/reservation/{_id?}', config: Controllers.Reservation.read },

        // File Upload
        { method: 'POST', path: '/media/', config: Controllers.Media.create },
        { method: 'GET', path: '/media/{_id?}', config: Controllers.Media.read },
        { method: 'DELETE', path: '/media/{_id}', config: Controllers.Media.delete },

        // vendor
        { method: 'POST', path: '/vendor/', config: Controllers.Vendor.create },
        { method: 'GET', path: '/vendor/{_id?}', config: Controllers.Vendor.read }
    ]);

    //== Move Along
    next();
};
exports.register.attributes = {
    name: 'routes',
    version: require('../package.json').version
};
