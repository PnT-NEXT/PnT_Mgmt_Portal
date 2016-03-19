angular.module('PnT_Portal')
    .service('DataService', function ($resource, $rootScope, $filter, $q, appSetting) {

            var _getStorage = function (type) {

                var storageAvailable = function (type) {
                    try {
                        var storage = window[type],
                            x = '__storage_test__';
                        storage.setItem(x, x);
                        storage.removeItem(x);
                        return true;
                    }
                    catch (e) {
                        console.log(type + ' is not available for current browser');
                        return false;
                    }
                };

                if (storageAvailable(type)) {
                    return {
                        get: function (key) {
                            return window[type].getItem(key);
                        },

                        set: function (key, obj) {
                            window[type].setItem(key, obj);
                        },

                        remove: function (key) {
                            window[type].removeItem(key);
                        },

                        clear: function () {
                            window[type].clear();
                        }
                    };
                }
            };

            /*get localStorage instance*/
            this.getLocalStorage = function () {
                return _getStorage('localStorage');
            };

            /*get sessionStorage instance*/
            this.getSessionStorage = function () {
                return _getStorage('sessionStorage');
            };

            var _callApi = function (url, params, actions) {
                return $resource(appSetting.virtualDir + '/api/' + url, params, actions);
            };

            this.getTrainings = function () {
                return $rootScope.trainings || [];
            };

            this.setTrainings = function (arr) {
                $rootScope.trainings = arr;
            };

            this.getUsers = function () {
                return $rootScope.users || [];
            };

            this.setUsers = function (arr) {
                $rootScope.users = arr;
            };

            this.setCurrentUser = function (user) {
                $rootScope.user = user;
            };

            this.getCurrentUser = function () {
                return $rootScope.user;
            };

            this.getTrainingById = function (id) {
                return $filter('filter')(($rootScope.trainings || []), {_id: id})[0];
            };

            this.getUserById = function (id) {
                return $filter('filter')(($rootScope.users || []), {_id: id})[0];
            };

            this.updateTraining = function (training) {
                var api = _callApi('training/:id', {id: '@_id'}, {update: {method: 'PUT'}});
                api.update(training);
            };

            this.updateUser = function (user) {
                var api = _callApi('user/:id', {id: '@_id'}, {update: {method: 'PUT'}});
                api.update(user);
            };

            this.queryAllTrainings = function (callback) {
                _callApi('training/:id', {id: '@_id'}).query(callback);
            };

            this.initialize = function () {
                var initialized = false;
                _callApi('init').get({}, function (user) {
                    $rootScope.user = user;
                });

                _callApi('user').query(function (users) {
                    $rootScope.users = users;
                });

                _callApi('training').query(function (trainings) {
                    $rootScope.trainings = trainings;
                });
            };
        }
    );

