var util = require('./helper/util');
util.mkdir('./uploads/');
process.env.NODE_ENV = 'dev';
var express = require('express'),
    app = express(),
    config = require('./config'),
    logger = require('./helper/logger'),
    initialRoute = require('./route/initialRoute'),
    trainingRoute = require('./route/trainingRoute'),
    userRoute = require('./route/userRoute'),
    reportRoute = require('./route/reportRoute'),

// upload file variables starts
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }),
    upload = multer({
        dest: './uploads/',
        storage: storage
    });

app
// set virtual directory for developer environment
    .use(express.static('public'))
    .use('/lib', express.static('bower_components'))
    .post('/api/training/file/upload|updateStatus', upload.single('file'), function (req, res, next) {
        next();
    })

    // Set Routes
    .use(config.virtualDir + '/api/init', initialRoute)
    .use(config.virtualDir + '/api/training', trainingRoute)
    .use(config.virtualDir + '/api/user', userRoute)
    .use(config.virtualDir + '/api/report', reportRoute)
 
    // return main page for SPA, this is not correct for all url return main page, there is a 404 error, only catch the main url
    .get(config.virtualDir + '/contacts', function (req, res) {
        res.sendfile('public/main.html');
    })
    .get(config.virtualDir + '/contact/new', function (req, res) {
        res.sendfile('public/main.html');
    })
    .get(config.virtualDir + '/training', function (req, res) {
        res.sendfile('public/main.html');
    })
    .get(config.virtualDir + '/training/upload', function (req, res) {
        res.sendfile('public/main.html');
    })
    .get(config.virtualDir + '/training/cart', function (req, res) {
        res.sendfile('public/main.html');
    })
    .get(config.virtualDir + '/training/assign', function (req, res) {
        res.sendfile('public/main.html');
    })
    .get(config.virtualDir + '/training/list2', function (req, res) {
        res.sendfile('public/main.html');
    })
    .get(config.virtualDir + '/user/detail', function (req, res) {
        res.sendfile('public/main.html');
    })
    .get(config.virtualDir + '/training/detail', function (req, res) {
        res.sendfile('public/main.html');
    })
    .get(config.virtualDir + '/', function (req, res) {
        res.sendfile('public/main.html');
    });


/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handling
// development error handler
// will print stacktrace
if (process.env.NODE_ENV == 'dev') {
    app.use(function (err, req, res, next) {
        logger.error('Dev Error Handler:');
        logger.error(err.status);
        if (err.status != 404) {
            logger.error('request error dev', err ? err.message : err, err ? err.stack : '');
        } else {
            logger.error('request oirginal is : ' + req.originalUrl);
        }
        res.status(err.status || 500);
        res.json('error', {
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        logger.error('Prod Error Handler:');
        logger.error(err.status);
        if (err.status != 404) {
            logger.error('request error dev', err ? err.message : err, err ? err.stack : '');
        }
        res.status(err.status || 500);
        res.json('error', {
            message: err.message,
            error: {}
        });
    });
}
app.listen(process.env.PORT || 3000, function () {
    console.log('server is running and listening on port ' + (process.env.PORT || 3000));
});
