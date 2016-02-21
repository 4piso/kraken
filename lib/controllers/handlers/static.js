// Internals ====================================
    const internals = {
        all: {
            handler: (request, reply) => {

                return reply.view('index');
            }
        },

        css: {
            directory: {
                path: __dirname + '/../../public/css',
                index: false
            }
        },

        img: {
            directory: {
                path: __dirname + '/../../public/img',
                index: false
            }
        },

        js: {
            directory: {
                path: __dirname + '/../../public/js',
                index: false
            }
        },

        views: {
            directory: {
                path: __dirname + '/../../public/views',
                index: false
            }
        },

        favicon: {
            file: __dirname + '/../../public/favicon.ico'
        },

        heartbeat: {
            handler: (request, reply) => {
                reply('OK');
            }
        }
    };

// Exposing =====================================
    module.exports = internals;