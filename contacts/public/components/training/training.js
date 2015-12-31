angular.module('PnT_Portal-training', ['ngRoute'])
    .controller('UploadController', function ($scope, Upload, $timeout, appSetting) {
        $scope.upload = function (file) {
            file.upload = Upload.upload({
                url: 'http://localhost' + (appSetting.serverPort ? ':' + appSetting.serverPort : ':80') + appSetting.virtualDir + '/training/file',
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

    .controller('CourcesListController', function ($scope, $resource, appSetting, TrainingFactory) {
        $scope.cources = TrainingFactory.query(function (cources) {
            $scope.hotCources = cources.slice(0, 6);  //top5 cources
            $scope.fields = Object.keys(cources[0]);
            $scope.sort.order = true;
            $scope.sort('name');

            //fake data
            $scope.cources.forEach(function (val, idx) {
                val.isChecked = idx % 3 === 0;
            });
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

        $scope.view = function (id) {
            $location.url(appSetting.virtualDir + '/training/' + id);
        }

        // orderby contains space, workaroud;
        // refer to: http://stackoverflow.com/questions/23420509/angularjs-orderby-with-space-in-property-name.
        $scope.predicate = function (rows) {
            return rows[$scope.sort.field];
        }

        $scope.toggleAll = function ($event) {
            if ($scope.cources.length > 0) {
                var anyChecked;
                $scope.cources.forEach(function (val, idx) {
                    if (val.isChecked) {
                        anyChecked = true;
                    }
                });

                $scope.cources.forEach(function (val, idx) {
                    val.isChecked = !anyChecked;
                });

                $event.target.checked = !anyChecked;
            }
        }
    })

    .factory('TrainingFactory', function ($resource, appSetting) {
        return $resource(appSetting.virtualDir + '/api/training/:id');
    })
;