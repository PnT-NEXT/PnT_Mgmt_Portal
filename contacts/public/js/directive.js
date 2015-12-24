angular.module('ContactsApp')
    .value('FieldTypes', {
        text: ['text', 'should be text'],
        email: ['email', 'should be email'],
        number: ['number', 'should be number'],
        date: ['date', 'should be date'],
        datetime: ['datetime', 'should be datetime'],
        time: ['time', 'should be time'],
        month: ['month', 'should be month'],
        week: ['week', 'should be week'],
        url: ['url', 'should be url'],
        tel: ['tel', 'should be url'],
        color: ['color', 'should be url']
    })
    .directive('formField', function($timeout, FieldTypes) {
        return {
            restrict: 'EA',
            templateUrl: 'views/form-field.html',
            replace: false,
            scope: {
                record: '=',
                field: '@',
                live: '@',
                required: '@'
            },
            link: function($scope, element, attr) {
                $scope.$on('record:invalid', function() {
                    $scope[$scope.field].$setDirty();
                });

                $scope.types = FieldTypes;
                $scope.remove = function(field) {
                    delete $scope.record[field];
                    $scope.blurUpdate();
                };

                $scope.blurUpdate = function() {
                    if ($scope.live !== 'false') {
                        $scope.record.$update(function(updatedRecord) {
                            $scope.record = updatedRecord;
                        });
                    }
                };

                var saveTimeOut;
                $scope.update = function() {
                    $timeout.cancel(saveTimeOut);
                    saveTimeOut = $timeout($scope.blurUpdate, 1000);
                };
            }
        };
    });