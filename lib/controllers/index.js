// Internals ====================================
	const internals = {
		Static: require('./handlers/static.js'),
		User: require('./api/user.js')
	};

// Exposing =====================================
	module.exports = internals;