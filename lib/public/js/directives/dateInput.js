//
// dateInput.js
// Luis Matute
//  Directive that handles dates for input type="date"
// --------------------------------------------------

'use strict';
// Dependencies & vars ==========================

// link =========================================
	var link = function(scope, elm, attrs, ngModelCtrl) {
		ngModelCtrl.$formatters.unshift(function (modelValue) {
			return date(modelValue, 'yyyy-MM-dd');
		});

		ngModelCtrl.$parsers.unshift(function(viewValue) {
			return new Date(viewValue);
		});
	};

// dateInput ====================================
	function dateInput(date) {
		return {
			require: 'ngModel',
			template: '<input type="date"></input>',
			replace: true,
			link: link
		};
	}

// @ngInject ====================================
	app.directive('dateInput', dateInput);