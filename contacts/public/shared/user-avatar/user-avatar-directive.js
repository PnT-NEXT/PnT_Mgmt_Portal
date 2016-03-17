angular.module('PnT_Portal-widget')
    .directive('userAvatar', function () {

        return {
            scope: {
                userId: '@',
                userName: '@',
                canDelete: '@',
                pxSize: '@',
                onDelete: '&'
            },

            restrict: 'EA',

            templateUrl: '/shared/user-avatar/user-avatar.html',

            compile: function (element, attrs) {
                if (!attrs.pxSize || (Number(attrs.pxSize) <= 50)) {
                    attrs.pxSize = 50; //default max rating if not set or out of scope.
                }
            },

            controller: function ($scope) {
                if (!$scope.pxSize || (Number($scope.pxSize) <= 50)) {
                    $scope.pxSize = 50;
                }

                $scope.rndColor = randomColor({hue: 'blue', seed: $scope.userId.hashCode()}); //'gray';

                var shortUserName = function (name) {
                    var nameSlices = name.split(/[ \(.,\-\)]+/).slice(0, 3);
                    var shortedName = "";
                    angular.forEach(nameSlices, function (s) {
                        if (s) {
                            shortedName += s[0];
                        }
                    });
                    return shortedName.toUpperCase();
                };
                $scope.name = shortUserName($scope.userName);

                $scope.isolatedDelete = function (param) {
                    if (angular.isFunction($scope.onDelete)) {
                        $scope.onDelete({param: param});
                    }
                };
            }
        };
    });