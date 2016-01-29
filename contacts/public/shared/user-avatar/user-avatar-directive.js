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

                var shortUserName = function (name) {
                    var nameSlices = name.split(/[ \(.,\)]+/).slice(0, 3);
                    var shortedName = "";
                    angular.forEach(nameSlices, function (s) {
                        if (s) {
                            shortedName += s[0];
                        }
                    });
                    return shortedName;
                };

                $scope.name = shortUserName($scope.userName);

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