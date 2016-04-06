var mongojs 		= require('mongojs'),
	db				= mongojs('trainingEvaluation', ['trainingClass']),
	util			= require('../helper/util'),
	trainingClass	= {};

db.on('error', function (err) {
	util.processError(err);
});

trainingClass.findAll = function (callback) {
	// throw new Error('test error from findAll method');
	db.trainingClass.find(function (err, docs) {
		callback(err, docs);
	});
};

/**
 * DB Insert Operation, the docs in the callback parameter contains the newly generate _id property
 */
trainingClass.insert = function (trainingClassCollection, callback) {
	db.trainingClass.insert(trainingClassCollection, function (err, docs) {
		callback(err, docs);
	});
};

module.exports = trainingClass;