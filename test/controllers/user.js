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
    }
};

// Test shortcuts ===============================
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const it = lab.test;

// Tests ========================================
describe('/user', () => {

    it('should create a user', (done) => {

        App.init(internals.manifest, internals.options, (err, server) => {

            if (err) {
                done();
            }

            const request = {
                method: 'POST',
                url: '/user/',
                payload: {
                    fname: 'testUser',
                    lname: 'testPassword',
                    email: 'test@test.com',
                    password: 'Testing01'
                }
            };

            server.inject(request, (response) => {
console.log(response);
                internals.resultID = response.data._id; // Update resultId
                Code.expect(response.statusCode).to.equal(200);
                done();
            });

            server.stop(done);
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
