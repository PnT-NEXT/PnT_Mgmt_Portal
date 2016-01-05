var express 	= require('express'),
	router 		= express.Router(),
	bodyParser 	= require('body-parser'),
	_ 			= require('lodash'),
	excel 		= require('xlsx'),
	model 		= require('../model'),
	fs			= require('fs');

router
	.route('/file')
	.post(function(req, res) {
		if (req.file.path) {
			var trainingCollection = [];
			var workbook = excel.readFile(req.file.path);
			workbook.SheetNames.forEach(function(value, index) {
				if (value === 'Course list') {
					var previousRow = '1';
					var training = {};
					for (z in workbook.Sheets[value]) {
						if (z[0] !== '!') {
							var row = z.match(/\d+/)[0];
							if (row === '1') {
								continue; // skip the header row
							}

							if (row !== previousRow) {
								if (previousRow !== '1') {
									trainingCollection.push(training);
									training = {};
								}
								previousRow = row;
							}

							var col = z.match(/[A-Z]+/)[0];
							var cellValue = _.trim(workbook.Sheets[value][z].v.toString()).replace(/\r?\n|\r/gm, '');

							switch (col) {
								case 'A':
									training.name = cellValue;
									break;
								case 'B':
									training.courseId = cellValue;
									break;
								case 'C':
									training.programType = cellValue;
									break;
								case 'D':
									training.duration = cellValue;
									break;
								case 'E':
									training.city = cellValue;
									break;
								case 'F':
									training.seat = cellValue;
									break;
								case 'G':
									training.cost = cellValue;
									break;
								case 'H':
									training.instructor = cellValue;
									break;

							}
						}
					}
					trainingCollection.push(training);
					training = {};

					// insert colleciont into db
					model.trainings.insert(trainingCollection, function(err, data) {
						fs.unlink(req.file.path);
						res.json({
							success: true,
							message: 'successfully upload ' + data.length + ' courses'
						});
					});
				}
			});
		}
	});

router
	.route('/')
	.get(function(req, res) {
		model.trainings.findAll(function(err, data) {
			res.json(data);
		});
	});

router
	.use(bodyParser.json())
	.param('id', function(req, res, next) {
		req.dbQuery = {
			courseId: req.params.id
		}; // here 10 means 10 base decimal system
		next();
	})
	.route('/:id')
	.get(function(req, res) {
		model.trainings.findOne(req.dbQuery, function(err, data) {
			res.json(data);
		});
	})
	.delete(function(req, res) {
		model.trainings.remove(req.dbQuery, true, function(err, result) {
			res.json(result);
		});
	})
	.put(function(req, res) {
		var training = req.body;
		delete training._id;
		delete training.$promise;
		delete training.$resolved;
		model.trainings.update(req.dbQuery, training, function(err, result) {
			res.json(result);
		});
	});

module.exports = router;