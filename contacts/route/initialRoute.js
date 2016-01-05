var express 	= require('express'),
	router 		= express.Router(),
	_			= require('lodash'),
	model		= require('../model'),
    config      = require('../config');

router
    .route('/')
    .get(function (req, res) {
        var dbQuery = {
            NTAccount: process.env.AUTH_USER || config.authUser;
        }
        model.users.findOne(dbQuery, function(err, data) {
            if (data) {
                // load the traning list based on user course id collection
                // and set to user courseDetailInformation
                var idCollection = _.map(data.courseList, toMongoId);
                if (idCollection.length > 0) {                    
                    var query = {
                        _id: {$in: idCollection}
                    }
                    model.trainings.find(query, function (err, courseDetailData) {
                        data.courseDetailList = courseDetailData;
                        res.json(data);
                    });
                } else {
                    res.json(data);
                }
            } else { // new user
                var user = {
                    NTAccount: config.authUser,
                    region: config.userRegion,
                    userName: config.userName,
                    email: config.email,
                    courseList: []
                }

                model.users.insert(user, function (err, docs) {
                    res.json(docs);
                });
            }           
        });
    });