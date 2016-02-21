'use strict';

// @ngInject ====================================
function Routes($stateProvider, $locationProvider, $urlRouterProvider, Config) {
	$stateProvider
		// Entry Point
			.state('login', {
				url: '/login',
				controller: 'loginCtrl',
				templateUrl: Config.tpl('login')
			})
			.state('inner', {
				controller: 'mainCtrl',
				templateUrl: Config.tpl('inner')
			})
				.state('inner.home', {
					url: '/home',
					templateUrl: Config.tpl('home')
				});

	$urlRouterProvider.otherwise('/login');
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}

module.exports = Routes;