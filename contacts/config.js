var _ 		= require('lodash'),
    path	= require('path'),
    fs		= require('fs'),
    config 	= {};

function initializeConfig() {
	if (_.isEmpty(config)) {
		try {
			config = require(path.resolve(__dirname, 'config.deploy.js')) || {};
		} catch (error) {
			console.log(error.name + ', message: ' + error.message);
		}

		config = updateEnvConfig(config);
	}
}

function updateEnvConfig(config) {
	if (process.env.NODE_ENV) {
		var envConfig = {};
		try {
			envConfig = require(path.resolve(__dirname, 'config.' + process.env.NODE_ENV + '.js')) || {};
			_.merge(config, envConfig);	
		} catch (error) {
			console.log(error.name + ', message: ' + error.message);
		}
	}

	return config;
}

initializeConfig();

module.exports = config;