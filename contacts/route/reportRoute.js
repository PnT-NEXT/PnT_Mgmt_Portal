var express     = require('express'),
    bodyParser  = require('body-parser'),
    router      = express.Router(),
    _           = require('lodash'),
    model       = require('../model'),
    logger      = require('../helper/logger'),
    q           = require('q');

router
    .route('/trainingClass')
    .get(function (req, res) {
        q
        .nfcall(model.trainingClass.findAll)
        .catch(function (err) {
            logger.error('Exception happens when get all the training class in report route', err);
            throw err;
        })
        .done(function (docs) {
            res.json(docs);
        });
    });

module.exports = router;