/**
 * Created by xiaofan on 1/7/2016.
 */

angular.module('PnT_Portal')
    .service('UserService', function (DataService, $filter) {

            /*wrap arguments to array*/
            var arg2Arr = function (arg) {
                var arr = [];
                if (arguments && arguments.length > 0) {
                    if (angular.isArray(arg)) {
                        return arg;
                    } else {
                        arr.push(arg);
                    }
                }
                return arr;
            };

            this.getAllUsers = function () {
                return DataService.getUsers();
            };

            this.getUser = function (userId) {
                return DataService.getUserById(userId);
            };

            /*update user training status for specified id list*/
            var updateTrainingStatus = function (_ids, status, onCompleted) {
                var idArr = arg2Arr(_ids);
                if (idArr.length > 0) {
                    var user = DataService.getCurrentUser();

                    angular.forEach(idArr, function (_id) {
                        var training = $filter('filter')(user.trainingList || [], {_id: _id})[0];
                        if (training) {
                            training.status = status;
                        } else {
                            training = DataService.getTrainingById(_id);
                            training.status = status;
                            user.trainingList.push(training);
                        }
                    });

                    DataService.updateUser(user);

                    if (angular.isFunction(onCompleted)) {
                        onCompleted();
                    }
                }
            };

            /*marke training as 'intrested'*/
            this.likeTraining = function (_ids, onCompleted) {
                updateTrainingStatus(_ids, 'interested', onCompleted);
            };

            /* marke training as 'not-intrested'*/
            this.notLikeTraining = function (_ids) {
                updateTrainingStatus(_ids, 'not-interested');
            };

            /*enroll a training, make it as 'reserved'*/
            this.enrollTraining = function (_ids) {
                updateTrainingStatus(_ids, 'reserved');
            };

            /*get all interested training of current user*/
            this.getLikedTrainings = function () {
                var user = DataService.getCurrentUser();
                var intrested = $filter('filter')(user.trainingList, {status: 'interested'});
                return intrested;
            };

            this.unassignTraining = function (userId, trainingId) {
                var user = DataService.getUserById(userId);
                _.remove(user.trainingList, {_id: trainingId});
                DataService.updateUser(user);
            };

            this.assignTraining = function (userId, trainingId) {
                var user = DataService.getUserById(userId);
                var training = _.find(user.trainingList, {_id: trainingId});
                if (!training) {
                    training = DataService.getTrainingById(trainingId);
                    user.trainingList.push(training);
                    DataService.updateUser(user);
                }
            };

        // this.updateUser = function (user) {
        //     DataService.updateUser(user);
        // };
        }
    );