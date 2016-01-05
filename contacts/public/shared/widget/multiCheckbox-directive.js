angular.module('PnT_Portal-widget', [])

    .directive('multiCheckbox', function () {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                checkboxes: '=',
                allselected: '=',
                allclear: '=',
                totalCount: '=',
                selectedCount: '='
            },
            template: '<input type="checkbox" ng-model="master" ng-change="masterChange()">',
            controller: function ($scope, $element) {
                $scope.masterChange = function () {
                    if ($scope.master) {
                        angular.forEach($scope.checkboxes, function (cb, index) {
                            cb.isSelected = true;
                        });
                    } else {
                        angular.forEach($scope.checkboxes, function (cb, index) {
                            cb.isSelected = false;
                        });
                    }
                };

                $scope.$watch('checkboxes', function () {
                    var allSet = true,
                        allClear = true,
                        selectedCnt = 0;

                    angular.forEach($scope.checkboxes, function (cb, index) {
                        if (cb.isSelected) {
                            allClear = false;
                            selectedCnt++;
                        } else {
                            allSet = false;
                        }
                    });

                    if ($scope.allselected !== undefined) {
                        $scope.allselected = allSet;
                    }
                    if ($scope.allclear !== undefined) {
                        $scope.allclear = allClear;
                    }

                    $scope.totalCount = $scope.checkboxes.length;
                    $scope.selectedCount = selectedCnt;

                    $element.prop('indeterminate', false);
                    if (allSet) {
                        $scope.master = true;
                    } else if (allClear) {
                        $scope.master = false;
                    } else {
                        $scope.master = false;
                        $element.prop('indeterminate', true);
                    }

                }, true);
            }
        };
    });