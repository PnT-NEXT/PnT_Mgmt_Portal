angular.module('PnT_Portal-widget')
    .directive('courceCard', function () {

        return {
            scope: {
                cource: '=',
                onMore: '&',
                onEnroll: '&',
                onRating: '&'
            },

            restrict: 'EA',

            templateUrl: '/shared/cource-card/cource-card.html',

            controller: function ($scope, $element, $attrs) {

                $scope.rating = 0;

                $scope.rndColor = randomColor({hue: 'blue', luminosity: 'light'});

                $scope.onClickMore = function (param) {
                    $scope.onMore({param: param});
                };

                $scope.onClickEnroll = function (param) {
                    $scope.onEnroll({param: param});
                };

                $scope.onClickRating = function (param) {
                    $scope.onRating({param: param});
                    if (!$scope.cource && $scope.cource.hasOwnProperty('rating')) {
                        $scope.cource.rating = $scope.rating;
                    }
                };
            }
        };
    });