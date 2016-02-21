// Load Modules =================================
    const Handlebars = require('handlebars');
    const Controllers = require('./controllers');

// Exposing Routes ==============================
    exports.register = (plugin, options, next) => {

        //== Routes
        plugin.route([
            // API
            { method: 'POST', path: '/user/', config: Controllers.User.create },
            // { method: 'GET', path: '/css/{path*}', handler: Controllers.Static.css },
            // { method: 'PUT', path: '/css/{path*}', handler: Controllers.Static.css },
            // { method: 'DELETE', path: '/css/{path*}', handler: Controllers.Static.css },
            // Assets & Static Routes
            { method: 'GET',  path: '/css/{path*}', handler: Controllers.Static.css },
            { method: 'GET',  path: '/img/{path*}', handler: Controllers.Static.img },
            { method: 'GET',  path: '/js/{path*}', handler: Controllers.Static.js },
            { method: 'GET',  path: '/views/{path*}', handler: Controllers.Static.views },
            { method: 'GET',  path: '/favicon.ico', handler: Controllers.Static.favicon },
            { method: 'GET',  path: '/heartbeat', config: Controllers.Static.heartbeat },
            { method: 'GET',  path: '/{p*}', config: Controllers.Static.all }
        ]);

        //== Views Engine
        plugin.views({
            engines: {
                html: {
                    module: Handlebars
                }
            },
            path: __dirname + '/views'
        });

        //== Move Along
        next();
    };
    exports.register.attributes = {
        name: 'routes',
        version: require('../package.json').version
    };
