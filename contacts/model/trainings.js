var mongojs 	= require('mongojs'),
	db			= mongojs('trainingEvaluation', ['trainings']),
	util		= require('../helper/util'),
	trainings	= {};

db.on('error', function (err) {
	util.processError(err);
});

trainings.findAll = function (callback) {
	db.trainings.find(function (err, docs) {
		callback(err, docs);
	});
};

trainings.find = function (query, callback) {
	db.trainings.find(query, function (err, docs) {
		callback(err, docs);
	});
};

trainings.findOne = function (query, callback) {
	db.trainings.findOne(query, function (err, docs) {
		callback(err, docs);
	});
};

/**
 * DB Insert Operation, the docs in the callback parameter contains the newly generate _id property
 */
trainings.insert = function (trainingCollection, callback) {
	db.trainings.insert(trainingCollection, function (err, docs) {
		callback(err, docs);
	});
};

/**
 * DB update operation, By default, this interface will update only one record If need to update multiple record, need to add a new interface
 */
trainings.update = function (query, training, callback) {
	db.trainings.update(query, training, function (err, result) {
		callback(result);
	});
};

/**
 * DB remove operation, By default, this interface will remove all the matching records If need to remove only a single record, need to add a new interface.
 */
trainings.remove = function (query, justone, callback) {
	db.trainings.remove(query, justone, function (err, result) {
		callback(result);
	});
};

module.exports = trainings;