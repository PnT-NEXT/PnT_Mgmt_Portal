(function () {
    var training = angular.module('PnT_Portal-training', ['ngRoute']);
    training.controller('UploadController', function ($scope, Upload, $timeout) {
        $scope.upload = function (file) {
            file.upload = Upload.upload({
                url: 'http://localhost:3000/uploadFile',
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
})();