angular.module('PnT_Portal')
    .service('TrainingService', function ($resource, $rootScope, $filter, $q, appSetting) {

        var callApi = function (url, params, actions) {
            return $resource(appSetting.virtualDir + '/api/' + url, params, actions);
        };

        var setTrainings = function (arr) {
            $rootScope.trainings = arr;
        };

        var getTrainings = function () {
            return $rootScope.trainings;
        };

        this.initialize = function () {
            callApi('training').query(function (resp) {
                setTrainings(resp);
            });
        };

        this.getAllTrainings = function () {
            return getTrainings();
        };

        this.getTraining = function (trainingId) {
            return $filter('filter')(trainings, {_id: trainingId})[0];
        };

        this.assignTrainingToUser = function (trainingId, userData) {
            var trainings = getTrainings();
            var training = $filter('filter')(trainings, {_id: trainingId})[0];
            if (training) {
                var user = $filter('filter')(training.userList, {_id: userData._id})[0];
                if (!user) {
                    training.userList.push({
                        _id: userData._id,
                        NTAccount: userData.NTAccount,
                        userName: userData.userName
                    });
                }
            }
        };

        this.getFactory = function () {
            return callApi('training/:id', {id: '@_id'}, {
                update: {
                    method: 'PUT', isArray: false
                }
            });
        }
    }
);