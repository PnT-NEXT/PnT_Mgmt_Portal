/*
 * ReadMe
 usage: <starrating max-rating="5" rating="myRating" read-only="true" color="red">{{myRating}}</starrating>
 clarify:
 - if not-readonly, it can be hovered and clicked to set a rating. otherwise, it shows rating.
 - color/size/maxRating attributes, click/mouseOver/mouseLeave...
 *
 */

angular.module('PnT_Portal-widget')
    .directive('starrating', function () {

        return {
            scope: {
                rating: '=',
                maxRating: '@',
                readOnly: '@',
                color: '@',
                size: '@',
                click: "&",
                mouseHover: "&",
                mouseLeave: "&"
            },

            restrict: 'EA',

            template: '<div ng-repeat="idx in maxRatings track by $index" style="display: inline-block; cursor:pointer;"> <i ng-class="{true: \'glyphicon glyphicon-star-empty\', false: \'glyphicon glyphicon-star\'}[(hoverValue + _rating) <=$index]" ng-Click="isolatedClick($index + 1)" ng-mouseenter="isolatedMouseHover($index + 1)" ng-mouseleave="isolatedMouseLeave($index + 1)" style="color: {{color}};font-size: {{size}}"> </i></div>',

            compile: function (element, attrs) {
                if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                    attrs.maxRating = 5; //default max rating if not set or out of scope.
                }
            },

            controller: function ($scope, $element, $attrs) {
                $scope.maxRatings = [];

                for (var i = 1; i <= $scope.maxRating; i++) {
                    $scope.maxRatings.push({});
                }

                $scope._rating = $scope.rating;

                $scope.isolatedClick = function (param) {
                    if ($scope.readOnly == 'true') return;

                    $scope.rating = $scope._rating = param;
                    $scope.hoverValue = 0;
                    $scope.click({
                        param: param
                    });
                };

                $scope.isolatedMouseHover = function (param) {
                    if ($scope.readOnly == 'true') return;

                    $scope._rating = 0;
                    $scope.hoverValue = param;
                    $scope.mouseHover({
                        param: param
                    });
                };

                $scope.isolatedMouseLeave = function (param) {
                    if ($scope.readOnly == 'true') return;

                    $scope._rating = $scope.rating;
                    $scope.hoverValue = 0;
                    $scope.mouseLeave({
                        param: param
                    });
                };
            }
        };
    });