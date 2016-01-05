var express 	= require('express'),
    bodyParser  = require('body-parser'),
	router 		= express.Router(),
	_			= require('lodash'),
    util        = require('../helper/util'),
	model		= require('../model'),
    config      = require('../config');

router
    .route('/')
    .get(function (req, res) {
        model.users.findAll(function(err, data) {
            res.json(data);
        });
    });

router    
    .use(bodyParser.json())
    .param('id', function (req, res, next) {
        req.dbQuery = {
            _id: req.params.id
        }; // here 10 means 10 base decimal system
        next();
    })
    .route('/:id')
    .get(function (req, res) {
        model.users.findOne(req.dbQuery, function(err, data) {
        	// load the traning list based on user course Id collection
        	// and set to user courseDetailInformation
            if (data)  {
                if (data.courseList.length > 0) {
                    var idCollection = _.map(data.courseList, util.toMongoId);
                    var query = {
                        _id: {$in: idCollection}
                    };
                    model.trainings.find(query, function (err, courseDetailData) {
                        user.courseDetailList = courseDetailData;
                        res.json(data);
                    });
                } else {
                    res.json(data);
                }
            } else {
                res.json(data);
            }
        });
    })
    .put(function (req, res) {
        var user = req.body;
        delete user._id;
        delete user.$promise;
        delete user.$resolved;
        delete user.courseDetailList;
        model.users.update(req.dbQuery, user, function(err, result) {
            res.json(result);
        });
    })
    .delete(function (req, res) {
        model.users.remove(req.dbQuery, true, function(err, result) {
            res.json(result);
        });
    });

module.exports = router;