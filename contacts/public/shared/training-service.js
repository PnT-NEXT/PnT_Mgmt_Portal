angular.module('PnT_Portal')
    .service('TrainingService', function ($resource, $filter, DataService, $q, appSetting) {

            this.getAllTrainings = function () {
                return DataService.getTrainings();
            };

            this.getTraining = function (trainingId) {
                return DataService.getTrainingById(trainingId);
            };

            this.assignTrainingToUser = function (trainingId, userId) {
                var training = DataService.getTrainingById(trainingId);
                if (training) {
                    var user = $filter('filter')(training.userList, {_id: userId})[0];
                    if (!user) {
                        user = DataService.getUserById(userId);
                        training.userList.push({
                            _id: userId,
                            NTAccount: user.NTAccount,
                            userName: user.userName
                        });
                        DataService.updateTraining(training);
                    }
                }
            };

            this.unassignTrainingToUser = function (trainingId, userId) {
                var training = DataService.getTrainingById(trainingId);
                if (training) {
                    var user = $filter('filter')(training.userList, {_id: userId})[0];
                    if (user) {
                        training.userList.splice(training.userList.indexOf(user), 1);
                    }
                    DataService.updateTraining(training);
                }
            };

            this.queryAll = function (callback) {
                DataService.queryAllTrainings(callback);
            };

            /*to be removed*/
            var _callApi = function (url, params, actions) {
                return $resource(appSetting.virtualDir + '/api/' + url, params, actions);
            };
            /*to be removed*/
            this.getFactory = function () {
                return _callApi('training/:id', {id: '@_id'}, {
                    update: {
                        method: 'PUT', isArray: false
                    }
                });
            }
        }
    );