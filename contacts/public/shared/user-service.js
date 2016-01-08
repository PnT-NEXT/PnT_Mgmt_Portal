/**
 * Created by xiaofan on 1/7/2016.
 */

angular.module('PnT_Portal')
    .service('UserService', function ($resource, $rootScope, $filter, appSetting) {

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

        var getUser = function () {
            return $rootScope.user;
        };

        var setUser = function (user) {
            $rootScope.user = user;
        };

        this.initialize = function () {
            callApi('init').get({}, function (data) {
                setUser(data);
            });
        };

        /*update user training status for specified id list*/
        var updateTrainingStatus = function (_ids, status) {
            var idArr = arg2Arr(_ids);
            if (idArr.length > 0) {
                var api = callApi('user/:id', {id: '@_id'}, {update: {method: 'PUT'}});
                var user = getUser();

                angular.forEach(idArr, function (_id) {
                    var cource = $filter('filter')(user.courseList, {_id: _id})[0];
                    if (cource) {
                        cource.status = status;
                    } else {
                        user.courseList.push({_id: _id, status: status});
                    }
                });

                api.update(user);
            }
        };

        /*marke training as 'intrested'*/
        this.likeTraining = function (_ids) {
            updateTrainingStatus(_ids, 'interested');
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
            var user = getUser();
            var intrested = $filter('filter')(user.courseList, {status: 'interested'});
            return intrested;
        };

        /* this.enrollTraining = function (_id) {
         var api = callApi('user/:id', {id: '@_id'}, {update: {method: 'PUT'}});
         var user = getUser();
         var cource = $filter('filter')(user.courseList, {_id: _id})[0];
         if (cource) {
         cource.status = 'reserved';
         } else {
         user.courseList.push({_id: _id, status: 'reserved'});
         }
         api.update(user);
         };*/
    }
);