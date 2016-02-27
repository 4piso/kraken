'use strict';

// Load Modules =================================
const Code = require('code');
const Lab = require('lab');
const App = require('../../lib');
const Path = require('path');
const Config = require('../../config/default.json');

// Declare internals ============================
const internals = {
    resultID: 0, // Initialize a variable to save the document ID later.
    manifest: Config.manifest,
    options: {
        relativeTo: Path.resolve(__dirname, '../../lib')
    },
    inject: (options) => {

        return new Promise((resolve, reject) => {

            server.inject(options, resolve);
        });
    }
};

// Test shortcuts ===============================
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

// Tests ========================================
describe('/user', () => {

    it('should create a user', (done) => {

        App.init(internals.manifest, internals.options, (err, server) => {

            expect(err).to.not.exist();

            const request = {
                method: 'GET',
                url: '/user/'
            };

            server.select('api').inject(request, (response) => {

                console.log(response);
                internals.resultID = response.data._id; // Update resultId
                expect(response.statusCode).to.equal(200);
                server.stop(done);
            });
        });
    });

    // it('should delete a user', (done) => {

    //     App.init(internals.manifest, internals.options, (err, server) => {

    //         let request = {
    //             method: 'DELETE',
    //             url: `/user/${internals.resultID}`
    //         };

    //         server.inject(request, (response) => {

    //             Code.expect(response.statusCode).to.equal(200);
    //             done();
    //         });

    //         server.stop(done);
    //     });
    // });
});
