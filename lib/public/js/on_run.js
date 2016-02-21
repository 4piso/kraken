"use strict";

// @ngInject ====================================
function on_run ( $rootScope, $state, Config ) {

	$rootScope.app_name = Config.app_name;
	$rootScope.title = Config.app_name;

	// Application Vars
	$rootScope._app = window._app;

	$rootScope.user = {
		name: ''
	};
}

module.exports = on_run;