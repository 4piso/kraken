'use strict';

// Load Modules =================================
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');
const App = require('../lib');
const Path = require('path');
const Config = require('../config/default.json');

// Declare internals ============================
const internals = {
    manifest: Config.manifest,
    options: {
        relativeTo: Path.resolve(__dirname, '../lib')
    }
};

// Test shortcuts ===============================
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

// Tests ========================================
describe('/index', () => {

    it('starts server and returns Hapi server object', (done) => {

        App.init(internals.manifest, internals.options, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.be.instanceof(Hapi.Server);

            server.stop(done);
        });
    });

    it('starts server on provided port', (done) => {

        App.init({ connections: [{ port: 5000, labels: ['api'] }] }, {}, (err, server) => {

            expect(err).to.not.exist();
            expect(server.select('api').info.port).to.equal(5000);

            server.stop(done);
        });
    });

    // it('forces re-routing to https', (done) => {

    //     App.init(internals.manifest, internals.composeOptions, (err, server) => {

    //         server.inject('/version', (res) => {

    //             expect(res.statusCode).to.equal(301);
    //             expect(res.headers.location).to.equal('https://localhost:8001/version');

    //             server.stop(done);
    //         });
    //     });
    // });

});
