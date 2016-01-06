/*db.training columns:
 * _id, name, courseId, programType, duration, city, seat, cost, instructor
 * */

(function () {
    angular.module('PnT_Portal-training', ['ngRoute', 'PnT_Portal-widget'])

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

        .controller('CourcesController', function ($scope, $location, appSetting, TrainingFactory, SharedDataService) {
            $scope.cources = TrainingFactory.query(function (cources) {
                $scope.hotCources = cources.slice(0, 6);  //top5 cources
                $scope.fields = Object.keys(cources[0]);
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
            }

            $scope.checkout = function () {
                function getSelected() {
                    var selected = [];
                    angular.forEach($scope.cources, function (obj, idx) {
                        if (obj.isSelected) {
                            selected.push(obj);
                        }
                    });
                    return selected;
                }

                SharedDataService.setSelectedCources(getSelected());
                $location.url(appSetting.virtualDir + '/training/cart');
            }
        })

        .controller('CartController', function ($scope, TrainingFactory, SharedDataService) {
            $scope.selectedCources = SharedDataService.getSelectedCources();

            checkSum = function () {
                var sum = 0, selected = 0;
                angular.forEach($scope.selectedCources, function (val, idx) {
                    if (val.isSelected) {
                        sum += Number(val.cost);
                        selected++;
                    }
                });
                $scope.totalCost = sum;
                $scope.totalSelected = selected;
            };

            $scope.submit = function () {
                //var selected = [];
                angular.forEach($scope.selectedCources, function (val, idx) {
                    if (val.isSelected) {
                        //selected.push(val);
                        val.city='HongHong';
                        TrainingFactory.update(val);
                    }
                });
                //TrainingFactory.bulkUpdate(selected);
            };

            $scope.toggle = function (id) {
                angular.forEach($scope.selectedCources, function (val, idx) {
                    if (val._id === id) {
                        $scope.selectedCources[idx].isSelected = !$scope.selectedCources[idx].isSelected;
                    }
                });
                checkSum();
            };

            checkSum();
        })

        .factory('TrainingFactory', function ($resource, appSetting) {
            return $resource(appSetting.virtualDir + '/api/training/:id', {id: '@_id'}, {
                update: {
                    method: 'PUT', isArray: false
                }
            });
        })
        .service('SharedDataService', function () {
            var selectedCources = [],
                getSelectedCources = function () {
                    return selectedCources || []
                },
                setSelectedCources = function (cources) {
                    selectedCources = cources || [];
                };

            return {
                getSelectedCources: getSelectedCources,
                setSelectedCources: setSelectedCources
            };
        })
    ;
})();
