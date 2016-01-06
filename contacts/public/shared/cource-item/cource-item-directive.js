angular.module('PnT_Portal-widget')
    .directive('courceCard', function () {

        return {
            scope: {
                cource: '@',
                onMore: '&',
                onEnroll: '&',
                onRating: '&'
            },

            restrict: 'EA',

            templateUrl: '/shared/cource-item/cource-item.html',

            controller: function ($scope, $element, $attrs) {
                $scope.courceObj = JSON.parse($scope.cource);

                $scope.rating = 0;

                $scope.onClickMore = function (param) {
                    $scope.onMore({param: param});
                };

                $scope.onClickEnroll = function (param) {
                    $scope.onEnroll({param: param});
                };

                $scope.onClickRating = function (param) {
                    $scope.onRating({param: param});
                    if (!$scope.courceObj && $scope.courceObj.hasOwnProperty('rating')) {
                        $scope.courceObj.rating = $scope.rating;
                    }
                };
            }
        };
    });