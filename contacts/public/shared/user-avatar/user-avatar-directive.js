angular.module('PnT_Portal-widget')
    .directive('userAvatar', function () {

        return {
            scope: {
                userId: '@',
                userName: '@',
                canDelete: '@',
                pxSize: '@',
                onDelete: '='
            },

            restrict: 'EA',

            templateUrl: '/shared/user-avatar/user-avatar.html',

            compile: function (element, attrs) {
                if (!attrs.pxSize || (Number(attrs.pxSize) <= 50)) {
                    attrs.pxSize = 50; //default max rating if not set or out of scope.
                }
            },

            controller: function ($scope) {
                $scope.rndColor = randomColor({hue: 'blue'});
                $scope.name = $scope.userName.substring(0, 1);
                $scope.showDelete = false;

                if (!$scope.pxSize || (Number($scope.pxSize) <= 50)) {
                    $scope.pxSize = 50;
                }

                $scope.isolatedDelete = function (param) {
                    $scope.onDelete({param: param});
                };

                $scope.isolatedMouseHover = function (param) {
                    $scope.showDelete = $scope.canDelete;
                };

                $scope.isolatedMouseLeave = function (param) {
                    $scope.showDelete = false;
                };
            }
        };
    });