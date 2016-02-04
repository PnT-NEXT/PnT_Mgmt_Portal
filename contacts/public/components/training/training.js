/*db.training columns:
 * _id, name, courseId, programType, duration, city, seat, cost, instructor
 * */

(function () {
    angular.module('PnT_Portal-training', ['ngRoute', 'ngDraggable', 'PnT_Portal-widget', 'PnT_Portal-message'])

        .controller('UploadController', function ($scope, Upload, $timeout, appSetting) {
            $scope.upload = function (file) {
                file.upload = Upload.upload({
                    url: 'http://localhost' + (appSetting.serverPort ? ':' + appSetting.serverPort : ':80') + appSetting.virtualDir + '/api/training/file',
                    data: {
                        file: file
                    }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        $scope.message = response.data.message;
                        $scope.progress = 100;
                    })
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 + evt.loaded / evt.total));
                });

                $scope.reset = function () {
                    $scope.message = '';
                    $scope.errorMsg = '';
                    $scope.progress = 0;
                };

                $scope.reset();
            };
        })

        .controller('TrainingsController', function ($scope, $location, appSetting, TrainingService, UserService) {
            $scope.cources = TrainingService.getFactory().query(function (cources) {
                $scope.hotCources = cources.slice(0, 6);  //top5 cources
                $scope.fields = Object.keys(cources[0]);
                $scope.fields = ['name', 'courseId', 'programType', 'duration', 'city', 'seat', 'instructor'];
                $scope.sort.order = true;
                $scope.sort('name');
            });

            $scope.reset = function () {
                $scope.sort.order = true;
                $scope.sort.field = '';
                $scope.cources = {};
                $scope.fields = {};
                $scope.actived = 0;
                $scope.selected = 0;
            };

            $scope.sort = function (field) {
                $scope.sort.field = field;
                $scope.sort.order = !$scope.sort.order;
            }

            // orderby contains space, workaroud;
            // refer to: http://stackoverflow.com/questions/23420509/angularjs-orderby-with-space-in-property-name.
            $scope.predicate = function (rows) {
                return rows[$scope.sort.field];
            }

            $scope.view = function (id) {
                $location.url(appSetting.virtualDir + '/training/' + id);
            };

            $scope.likeAll = function () {
                var _ids = [];
                angular.forEach($scope.cources, function (c) {
                    if (c.isSelected) {
                        _ids.push(c._id);
                    }
                });

                UserService.likeTraining(_ids, function () {
                    $location.url(appSetting.virtualDir + '/training/cart');
                });
            };

            $scope.$watch("cources | filter : query | orderBy: predicate : sort.order", function (newVal) {
                $scope.filteredCources = newVal;
            }, true);
        })

        .controller('CartController', function ($scope, UserService) {

            $scope.cources = UserService.getLikedTrainings();

            $scope.enrollAll = function () {
                var _ids = [];
                angular.forEach($scope.cources, function (c) {
                    _ids.push(c._id);
                })
                UserService.enrollTraining(_ids);
            };

            $scope.enroll = function (_id) {
                UserService.enrollTraining(_id);
            };
        })
        
        .controller('TrainingDetailController', function($scope, $filter,$rootScope, $routeParams, TrainingService, UserService) {
            if ($routeParams._id) {            
                $scope.training = TrainingService.getTraining($routeParams._id);
                $scope.userList = $scope.training.userList;
            }
            
        })

        .controller('AssignmentController', function ($scope, $filter, TrainingService, UserService) {
            $scope.trainings = TrainingService.getAllTrainings();
            $scope.users = UserService.getAllUsers();

            $scope.predicate = function (rows) {
                return rows['name'];
            }
            
            $scope.getUserLiked = function (user) {
                return $filter('filter')(user.trainingList, {status: 'interested'}).length;
            };

            $scope.getUserTaken = function (user) {
                return $filter('filter')(user.trainingList, {status: 'reserved'}).length;
            };

            $scope.onDragComplete = function (data, evt) {
                //TrainingService.assignTrainingToUser()
            };

            $scope.onDropComplete = function (user, training) {
                if (user && training) {
                    TrainingService.assignTrainingToUser(training._id, user);

                    var tr = _.find(user.trainingList, {_id: training._id});
                    if (!tr) {
                        user.trainingList.push(training);
            }
                    UserService.updateUser(user);
                }
            };

            $scope.onDeleteUser = function (user, training) {
                if (user && training) {
                    _.remove(user.trainingList, {_id: training._id});
                    UserService.updateUser(user);
                    TrainingService.unassignTrainingToUser(training._id, user);
            }
            };
        });
})();
