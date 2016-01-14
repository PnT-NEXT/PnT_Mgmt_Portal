    angular.module('PnT_Portal-message', [])
        .directive('messageBox', ['UserService', function(UserService) {

            return {

                restrict: 'EA',

                templateUrl: '/shared/message-box/message-box.html',

                controller: function($scope, $element, $attrs, $rootScope) {
                    setTimeout(function() {
                        $('#slide-bottom-popup').modal('show');
                    }, 1000); // milliseconds           
                }
            };
        }]);
