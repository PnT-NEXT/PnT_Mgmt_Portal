angular.module('PnT_Portal')
    .service('TrainingService', function ($resource, $rootScope, $filter, $q, appSetting) {

        var _callApi = function (url, params, actions) {
            return $resource(appSetting.virtualDir + '/api/' + url, params, actions);
        };

        var _setTrainings = function (arr) {
            $rootScope.trainings = arr;
        };

        var _getTrainings = function () {
            return $rootScope.trainings;
        };

        var _getTrainingById = function (trainingId) {
            return $filter('filter')(_getTrainings(), {_id: trainingId})[0];
        };

        var _updateTraining = function (training) {
            var api = _callApi('training/:id', {id: '@_id'}, {update: {method: 'PUT'}});
            api.update(training);
        };

        var _updateUser = function (user) {
            var api = _callApi('user/:id', {id: '@_id'}, {update: {method: 'PUT'}});
            api.update(user);
        };

        this.initialize = function () {
            _callApi('training').query(function (resp) {
                _setTrainings(resp);
            });
        };

        this.getAllTrainings = function () {
            return _getTrainings();
        };

        this.getTraining = function (trainingId) {
            return _getTrainingById(trainingId);
        };

        this.assignTrainingToUser = function (trainingId, userData) {
            var training = _getTrainingById(trainingId);
            if (training) {
                var user = $filter('filter')(training.userList, {_id: userData._id})[0];
                if (!user) {
                    training.userList.push({
                        _id: userData._id,
                        NTAccount: userData.NTAccount,
                        userName: userData.userName
                    });
                    _updateTraining(training);
                }
            }
        };

        this.unassignTrainingToUser = function (trainingId, userData) {
            var training = _getTrainingById(trainingId);
            if (training) {
                var user = $filter('filter')(training.userList, {_id: userData._id})[0];
                if (user) {
                    training.userList.splice(training.userList.indexOf(user), 1);
                }
                _updateTraining(training);
            }
        };

        this.getFactory = function () {
            return _callApi('training/:id', {id: '@_id'}, {
                update: {
                    method: 'PUT', isArray: false
                }
            });
        }
    }
);