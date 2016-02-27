'use strict';

// Internals ====================================
const internals = {
    User: require('./api/user.js'),
    Team: require('./api/team.js'),
    Service: require('./api/service.js'),
    Product: require('./api/product.js')
};

// Exposing =====================================
module.exports = internals;
