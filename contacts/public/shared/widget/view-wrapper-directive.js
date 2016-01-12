/**
 * Created by xiaofan on 1/12/2016.
 */

angular.module('PnT_Portal-widget')
    .directive('viewWrapper', function ($window) {
        return {

            restrict: 'EA',

            link: function (scope, element) {

                scope.$watch
                (
                    function () {
                        return element.height();
                    },

                    function (newValue, oldValue) {
                        if (newValue != oldValue) {
                            var actualHeight = element.height();
                            var actualMinHeight = element.css('min-height').replace(/[^\d.-]/g, '');
                            if (/*actualHeight === newValue ||*/ actualMinHeight === newValue) {
                                return;
                            }

                            var blankHeight = $window.window.innerHeight
                                - Math.min($window.window.document.body.offsetHeight, $window.window.document.documentElement.offsetHeight);
                            element.css('min-height', (actualHeight + blankHeight) + 'px');
                        }
                    }
                );
            }
        }
    });