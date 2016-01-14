var express     = require('express'),
    router      = express.Router(),
    _           = require('lodash'),
    model       = require('../model'),
    config      = require('../config'),
    util        = require('../helper/util');

router
    .route('/')
    .get(function (req, res) {
        var dbQuery = {
            NTAccount: process.env.AUTH_USER || config.authUser
        };
        model.users.findOne(dbQuery, function (err, docs) {
            if (docs) {
                // load the traning list based on user course id collection
                // and set to user courseDetailInformation
                var idCollection = _.map(docs.trainingList, util.toMongoId);
                if (idCollection.length > 0) {                    
                    var query = {
                        _id: {$in: idCollection}
                    };
                    model.trainings.find(query, function (err, trainingDetailList) {
                        _.each(trainingDetailList, function (val) {
                            var tempTraining = _.find(docs.trainingList, {_id: val._id.toString()});
                            if (tempTraining) {
                                val.status = tempTraining.status;
                            }
                        });
                        docs.trainingList = trainingDetailList;
                        res.json(docs);
                    });
                } else {
                    res.json(docs);
                }
            } else { // new user
                var user = {
                    NTAccount: config.authUser,
                    region: config.userRegion,
                    userName: config.userName,
                    email: config.email,
                    trainingList: []
                };

                model.users.insert(user, function (err, docs) {
                    res.json(docs);
                });
            }           
        });
    });

module.exports = router;