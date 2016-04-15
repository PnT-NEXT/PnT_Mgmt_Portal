'use strict';
var express       = require('express'),
    router        = express.Router(),
    bodyParser    = require('body-parser'),
    fs            = require('fs'),
    _             = require('lodash'),
    excel         = require('xlsx'),
    model         = require('../model'),
    util          = require('../helper/util'),
    logger        = require('../helper/logger'),
    q             = require('q');

var DEFAULT_TRAINING_PROGRAM_TYPE = 'Professional Skills/Other';

var COL_TRAINING_TITLE = 'Course Title';
var COL_COMPLETE_STATUS = 'Completion Status';
var COL_PERSION_NAME = 'Person Full Name';
var COL_PERSION_EMAIL = 'Person E-mail';
var COL_PERSION_EID = 'Person Person No';
var COL_PERSION_STATUS = 'Person Status';
var COL_PERSION_EMPLOYEE_TYPE = 'Person Employee Type';
var COL_PERSION_TYPE = 'Person Type';
var COL_CLASS_START_DATE = 'Class Start Date';
var COL_CLASS_COMPLETE_DATE = 'Completed Courses (Transcript) Ended/Completed On Date';
var COL_COURSE_ID = 'Course Course ID';
var COL_COURSE_PROGRAM_TYPE = 'Course Program';
var COL_CLASS_DELIVERY_NAME = 'Class Delivery Name';
var COL_CLASS_ID = 'Class ID';
var COL_CLASS_DURATION = 'Completed Courses (Transcript) Duration (HH:MM)';
var COL_IS_HOC_TRANSCRIPT = 'Is ad hoc transcript';
var COL_HEAD_COUNT = 'Head Count';

router
    .route('/file/updateStatus')
    .post(function (req, res) {
        if (req.file.path) {
            var trainingCollection = [];
            var userCollection = [];
            var training = { classList: [] };
            var user = {};
            var trainingClass = {};
            var workbook = excel.readFile(req.file.path);
            workbook.SheetNames.forEach(function (value, index) {
                if (value === 'list') {
                    var recordList = excel.utils.sheet_to_json(workbook.Sheets[value]);
                    console.log('total record count: ' + Object.keys(recordList).length);
                    var record = {};
                    var trainingStatus = '';
                    var trainingClass = {};
                    for (var i = 0; i < Object.keys(recordList).length; i+=1) {
                        record = recordList[i];
                        if (record[COL_TRAINING_TITLE]) {
                            // console.log('This is a training: ' + record[COL_TRAINING_TITLE]);
                            if (training.title) {                                
                                trainingCollection.push(training);
                                training = { title: record[COL_TRAINING_TITLE], classList: [] };
                            } else {
                                training.title = record[COL_TRAINING_TITLE];
                            }
                        } else if (record[COL_COMPLETE_STATUS]) {
                            // console.log('This is a training status: ' + record[COL_COMPLETE_STATUS]);
                            if (trainingStatus !== record[COL_COMPLETE_STATUS]) {
                                trainingStatus = record[COL_COMPLETE_STATUS];
                            }
                        } else if (record[COL_PERSION_EMAIL] !== '') {
                            if (record[COL_COURSE_ID]) {
                                training.trainingId = record[COL_COURSE_ID];
                            }
                            if (record[COL_COURSE_PROGRAM_TYPE]) {
                                training.programType = record[COL_COURSE_PROGRAM_TYPE];
                            } else {
                                training.programType = DEFAULT_TRAINING_PROGRAM_TYPE;
                            }


                            trainingClass = { status: trainingStatus };
                            if (record[COL_CLASS_START_DATE]) {
                                trainingClass.startDate = new Date(record[COL_CLASS_START_DATE]);
                            }
                            if (record[COL_CLASS_COMPLETE_DATE]) {
                                trainingClass.completeDate = new Date(record[COL_CLASS_COMPLETE_DATE]);
                            }
                            if (record[COL_CLASS_DELIVERY_NAME]) {
                                trainingClass.delivery = record[COL_CLASS_DELIVERY_NAME];
                            }
                            if (record[COL_CLASS_ID]) {
                                trainingClass.classID = record[COL_CLASS_ID];
                            }
                            if (record[COL_IS_HOC_TRANSCRIPT]) {
                                trainingClass.isHOC = record[COL_IS_HOC_TRANSCRIPT];
                            }
                            if (record[COL_HEAD_COUNT]) {
                                trainingClass.headCount = record[COL_HEAD_COUNT];
                            }
                            if (record[COL_PERSION_EMAIL]) {
                                trainingClass.userEmail = record[COL_PERSION_EMAIL];
                                training.classList.push(trainingClass); // TODO: ask aaron how to understand the duration
                            } else {
                                logger.info();
                            }

                            if (!_.find(userCollection, {'employeeID': record[COL_PERSION_EID]}) && record[COL_PERSION_EID]) {
                                user = {};
                                if (record[COL_PERSION_NAME]) {
                                    user.userName = record[COL_PERSION_NAME];
                                }
                                if (record[COL_PERSION_EMAIL]) {
                                    user.email = record[COL_PERSION_EMAIL];
                                }
                                if (record[COL_PERSION_EID]) {
                                    user.employeeID = record[COL_PERSION_EID];
                                }
                                if (record[COL_PERSION_TYPE]) {
                                    user.type = record[COL_PERSION_TYPE];
                                }
                                if (record[COL_PERSION_EMPLOYEE_TYPE]) {
                                    user.employeeType = record[COL_PERSION_EMPLOYEE_TYPE];
                                }
                                if (record[COL_PERSION_STATUS]) {
                                    user.status = record[COL_PERSION_EMPLOYEE_TYPE];
                                }

                                userCollection.push(user);
                            }
                        }
                    }

                    if (training.title) {
                        trainingCollection.push(training);
                    }

                    var trainingCount = 0;

                    q
                    .nfcall(model.trainingClass.insert, trainingCollection)
                    .then(function(docs) {
                        if (docs) {
                            trainingCount = docs.length;
                            console.log('find all users here');
                            return q.nfcall(model.users.findAll);
                        }
                    })
                    .then(function (users) {
                        var tempUser = {};
                        var promiseArray = [];
                        _.each(userCollection, function (user) {
                            if (user.email) {
                                tempUser = _.find(users, {email: user.email});
                                if (tempUser) {
                                    tempUser.userName = user.userName;
                                    tempUser.employeeID = user.employeeID;
                                    tempUser.type = user.type;
                                    tempUser.status = user.status;
                                    tempUser.employeeType = user.employeeType;
                                    promiseArray.push(q.nfcall(model.users.update, { _id: tempUser._id }, tempUser));
                                } else {
                                    promiseArray.push(q.nfcall(model.users.insert, user));
                                }
                            }
                        });
                        
                        console.log(promiseArray.length);
                        return q.all(promiseArray);
                    })
                    .catch(function (err) {
                        logger.error('error happens when insert training class collection', err);
                        throw err;
                    })
                    .done(function () {
                        fs.unlink(req.file.path);
                        res.json({
                            success: true,
                            message: 'successfully upload ' + trainingCount + ' courses'
                        });
                    });
                }
            });
        }
    });

router
    .route('/file/upload')
    .post(function (req, res) {
        if (req.file.path) {
            var trainingCollection = [];
            var workbook = excel.readFile(req.file.path);
            workbook.SheetNames.forEach(function (value, index) {
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
                    model.trainings.insert(trainingCollection, function (err, data) {
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
    .get(function (req, res) {
        var loopCount = 0;
        model.trainings.findAll(function (err, trainingList) {
            _.each(trainingList, function (training) {
                var query = {
                    trainingList: {
                        $elemMatch: {
                            _id: training._id.toString()
                        }
                    }
                };

                model.users.find(query, function (err, userList) {
                    if (userList) {
                        _.each(userList, function (user) {
                            _.each(user, function (val, key) {
                                if (key !== '_id' && key !== 'NTAccount' && key !== 'userName') {
                                    delete user[key];
                                }
                            });
                        });
                        training.userList = userList;
                    }

                    if (++loopCount === trainingList.length) {
                        res.json(trainingList);
                    }
                });
            });
        });
    });

router
    .use(bodyParser.json())
    .param('id', function (req, res, next) {
        req.dbQuery = {
            _id: util.strToMongoId(req.params.id.toString())
        }; // here 10 means 10 base decimal system
        next();
    })
    .route('/:id')
    .get(function (req, res) {
        model.trainings.findOne(req.dbQuery, function (err, training) {
            if (training) {
                var query = {
                    trainingList: {
                        $elemMatch: {
                            _id: training._id.toString()
                        }
                    }
                };

                model.users.find(query, function (err, userList) {
                    if (userList) {
                        _.each(userList, function (user) {
                            _.each(user, function (val, key) {
                                if (key !== '_id' && key !== 'NTAccount' && key !== 'userName') {
                                    delete user[key];
                                }
                            });
                        });
                        training.userList = userList;
                    }

                    res.json(training);
                });
            }
        });
    })
    .delete(function (req, res) {
        model.trainings.remove(req.dbQuery, true, function (result) {
            res.json(result);
        });
    })
    .put(function (req, res) {
        var training = req.body;
        delete training._id;
        delete training.$promise;
        delete training.$resolved;
        model.trainings.update(req.dbQuery, training, function (result) {
            res.json(result);
        });
    });

module.exports = router;