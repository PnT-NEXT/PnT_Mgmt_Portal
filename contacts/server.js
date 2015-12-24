var express = require('express'),
	api = require('./api'),
	app = express(),
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
	uploadRouter = require('./routes/uploadRouter');

app
	.use(express.static('public'))
	.use('/lib', express.static('bower_components'))
	.use('/api', api)
	.post('/uploadFile', upload.single('file'), function(req, res, next) {
		next();
	})
	.use('/uploadFile', uploadRouter)
	.get('*', function(req, res) {
		res.sendfile('public/main.html');
	})
	.listen(3000);