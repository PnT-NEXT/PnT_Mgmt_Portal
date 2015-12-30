var express = require('express'),

	// upload file variables starts
	multer = require('multer'),
	storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, './uploads')
		},
		filename: function(req, file, cb) {
			cb(null, Date.now() + '-' + file.originalname)
		}
	}),
	upload = multer({
		dest: './uploads/',
		storage: storage
	}),
	// upload file variables ends

	// my server variables 
	config = require('./config'),
	api = require('./route/api'),
	trainingRoute = require('./route/trainingRoute'),
	app = express(),

	logger = require('./helper/logger');

app
	// set virtual directory for developer environment
	.use(express.static('public'))
	.use('/lib', express.static('bower_components'))

	// set middle ware
	.post(config.virtualDir + '/training/file', upload.single('file'), function(req, res, next) {
		next();
	})

	// Set Routes
	.use(config.virtualDir + '/training', trainingRoute)
	.use(config.virtualDir + '/api', api)
	
	// return main page for SPA, this is not correct for all url return main page, there is a 404 error, only catch the main url
	.get(config.virtualDir + '/contacts', function(req, res) {
		res.sendfile('public/main.html');
	})
	.get(config.virtualDir + '/contact/new', function(req, res) {
		res.sendfile('public/main.html');
	})
	.get(config.virtualDir + '/upload', function(req, res) {
		res.sendfile('public/main.html');
	});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handling
// development error handler
// will print stacktrace
if (process.env.NODE_ENV == 'dev') {
    app.use(function(err, req, res, next) {
		console.log('Dev Error Handler:');
		logger.error('Dev Error Handler:');
		console.log(err.status);
		logger.error(err.status);
        if (err.status != 404) {
            console.log('request error dev', err ? err.message : err, err ? err.stack : '');
        }
        res.status(err.status || 500);
        res.json('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	console.log('Enter prod error handler');
	console.log('request error dev', err ? err.message : err, err ? err.stack : '');
    res.status(err.status || 500);
    res.json('error', {
        message: err.message,
        error: {}
    });
});

app.listen(process.env.PORT || 3000);