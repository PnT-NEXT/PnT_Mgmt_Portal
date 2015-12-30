
angular.module('PnT_Portal-training', ['ngRoute'])
    .controller('UploadController', function ($scope, Upload, $timeout, appSetting) {
        $scope.upload = function (file) {
            file.upload = Upload.upload({
                url: 'http://localhost' + (appSetting.serverPort ? ':' + appSetting.serverPort : ':80') + appSetting.virtualDir +'/training/file',
                data: {
                    file: file
                }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                })
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 + evt.loaded / evt.total));
            });
        };
    });