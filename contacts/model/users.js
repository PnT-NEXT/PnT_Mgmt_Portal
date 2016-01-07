var mongojs = require('mongojs'),
	db		= mongojs('trainingEvaluation', ['users']),
	util	= require('../helper/util'),
	users	= {};

db.on('error', function (err) {
	util.processError(err);
});

users.findAll = function (callback) {
	db.users.find(function (err, docs) {
		callback(err, docs);
	});
}

users.find = function(query, callback) {
	db.users.find(query, function (err, docs) {
		callback(err, docs);
	});
}

users.findOne = function (query, callback) {
	db.users.findOne(query, function (err, docs) {
		callback(err, docs);
	});
}

/**
 * DB Insert Operation, the docs in the callback parameter contains the newly generate _id property
 */
users.insert = function (userCollection, callback) {
	db.users.insert(userCollection, function (err, docs) {
		callback(err, docs);
	});
}


/**
 * DB update operation, By default, this interface will update only one record If need to update multiple record, need to add a new interface
 */
users.update = function (query, user, callback) {
	db.users.update(query, user, function (err, result) {
		callback(err, result);
	});
}

/**
 * DB remove operation, By default, this interface will remove all the matching records If need to remove only a single record, need to add a new interface.
 */
users.remove = function (query, justone, callback) {
	db.users.remove(query, justone, function (err, result) {
		callback(err, result);
	});
}

module.exports = users;