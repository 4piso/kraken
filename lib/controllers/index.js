// Internals ====================================
	const internals = {
		User: require('./api/user.js'),
		Service: require('./api/service.js'),
		Product: require('./api/product.js')
	};

// Exposing =====================================
	module.exports = internals;