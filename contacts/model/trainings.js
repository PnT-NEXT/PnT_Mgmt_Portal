var mongojs = require('mongojs'),
	db		= mongojs('contactlist', ['trainings']),
	trainings= {};

trainings.find = function (callback) {
	db.trainings.find(function (err, data) {
		callback(err, data);
	});
}

trainings.findOne = function (query, callback) {
	db.trainings.findOne(query, function (err, data) {
		callback(err, data);
	});
}

trainings.insert = function (trainingCollection, callback) {
	db.trainings.insert(trainingCollection, function (err, data) {
		callback(err, data);
	});
}

trainings.update = function (query, training, callback) {
	console.log(query);
	db.trainings.update(query, training, function (err, data) {
		callback(err, data);
	});
}

trainings.remove = function (query, justone, callback) {
	db.trainings.remove(query, justone, function () {
		callback();
	});
}

module.exports = trainings;