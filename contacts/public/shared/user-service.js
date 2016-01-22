/**
 * Created by xiaofan on 1/7/2016.
 */

angular.module('PnT_Portal')
    .service('UserService', function ($resource, $rootScope, $filter, $q, appSetting) {

        var callApi = function (url, params, actions) {
            return $resource(appSetting.virtualDir + '/api/' + url, params, actions);
        };

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

        var getTraining = function (_id) {
            var d = $q.defer();
            var result = callApi('training/:id').get({id: _id}, function () {
                d.resolve(result);
            });
            return d.promise;
        };

        var getCurrentUser = function () {
            return $rootScope.user;
        };

        var setCurrentUser = function (user) {
            $rootScope.user = user;
        };


        this.initialize = function () {
            callApi('init').get({}, function (data) {
                setCurrentUser(data);
            });

            callApi('user').query(function (users) {
                $rootScope.users = users;
            })
        };

        this.getAllUsers = function () {
            return $rootScope.users;
        };

        /*update user training status for specified id list*/
        var updateTrainingStatus = function (_ids, status, onCompleted) {
            var idArr = arg2Arr(_ids);
            if (idArr.length > 0) {
                var api = callApi('user/:id', {id: '@_id'}, {update: {method: 'PUT'}});
                var user = getCurrentUser();

                var promises = [];
                angular.forEach(idArr, function (_id) {
                    var training = $filter('filter')(user.trainingList, {_id: _id})[0];
                    if (training) {
                        training.status = status;
                    } else {
                        promises.push(getTraining(_id));
                    }
                });
                $q.all(promises).then(function (trainingArr) {
                    if (angular.isArray(trainingArr)) {
                        angular.forEach(trainingArr, function (training) {
                            training.status = status;
                            user.trainingList.push(training);
                        });
                    }
                    api.update(user);
                    //fire onCompleted callback
                    if (angular.isFunction(onCompleted)) {
                        onCompleted();
                    }
                });
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
            var user = getCurrentUser();
            var intrested = $filter('filter')(user.trainingList, {status: 'interested'});
            return intrested;
        };

        /* this.enrollTraining = function (_id) {
         var api = callApi('user/:id', {id: '@_id'}, {update: {method: 'PUT'}});
         var user = getCurrentUser();
         var cource = $filter('filter')(user.trainingList, {_id: _id})[0];
         if (cource) {
         cource.status = 'reserved';
         } else {
         user.trainingList.push({_id: _id, status: 'reserved'});
         }
         api.update(user);
         };*/
    }
);