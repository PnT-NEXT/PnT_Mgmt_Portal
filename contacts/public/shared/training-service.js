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

        this.getFactory = function () {
            return callApi('training/:id', {id: '@_id'}, {
                update: {
                    method: 'PUT', isArray: false
                }
            });
        }
    }
);