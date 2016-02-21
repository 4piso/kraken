// Dependencies =================================
	var env = {
		"dev": {
			"name": "src",
			"host": "localhost"
		},
		"prd": {
			"name": "dist",
			"host": "localhost"
		}
	};

// Exposing Settings ============================
	module.exports = {
		app_name: window._app.name || '',
		env: env[window._app.env || 'dev'],
		tpl: function (view) {
			return '/views/'+view+'.html';
		}
	};