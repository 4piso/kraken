'use strict';

// Dependencies =================================
var Nes = require('nes');


// Factory ======================================
var NesService = function( $rootScope ) {

    var host = 'localhost:3000';
    var client = new Nes.Client( 'ws://' + host );

    var service = {
        on: function ( eventName, callback ) {

            client[ 'on' + eventName ] = function ( msg ) {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(client, args);
                });
            };
        },
        message: function ( msg ) {

            var msgObj = {
                username: $rootScope.user.name,
                message: msg
            };

            client.message( msgObj );
        },
        client: client
    };

    angular.extend(this, service);

};

// @ngInject ====================================
_chat.service('NesService', NesService);