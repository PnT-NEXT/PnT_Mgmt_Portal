var express = require('express'),
	router = express.Router(),
	excel = require('xlsx');

router
	.route('/')
	.post(function(req, res) {
		console.log(req.file);
		if (req.file.path) {
			var workbook = excel.readFile(req.file.path);
			workbook.SheetNames.forEach(function(value, index) {
				console.log(value);
				if (value === 'Course list') {
					for (z in workbook.Sheets[value]) {
						if (z[0] !== '!') {
							console.log(workbook.Sheets[value][z]);
							console.log(z + ' = ' + JSON.stringify(workbook.Sheets[value][z].v));
						}
					}
				}
			});
		}

		res.json({
			success: true
		});
	});

module.exports = router;