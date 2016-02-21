'use strict';

// Dependencies =================================
    var internals = {};

// Controller Functions =========================
    var mainCtrl = function ($scope, $rootScope, $state, NesService) {

        var client = NesService.client;

        client.connect( function (err) {
            if ( err ) console.error(err);
        });

        client.

        $scope.data ={
            user: $rootScope.user
        };

        $scope.submitMsg = function () {

            if ( $scope.data.message !== "" ) {
                NesService.message( $scope.data.message );
                $scope.data.message = "";
            }
        };

        $rootScope.$on( '$stateChangeStart', function ( evt ) {

            if ( $rootScope.user.name === '' ) {
                $state.go( 'login' );
                return false;
            }
        });
    };

// @ngInject ====================================
    _chat.controller('mainCtrl', mainCtrl);
