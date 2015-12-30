var mongojs = require('mongojs'),
	db		= mongojs('contactlist', ['contacts']),
	contacts= {};

contacts.find = function (callback) {
	db.contacts.find(function (err, data) {
		callback(err, data);
	});
}

module.exports = contacts;