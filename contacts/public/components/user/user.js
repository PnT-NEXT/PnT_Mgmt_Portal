/*db.training columns:
 * _id, name, courseId, programType, duration, city, seat, cost, instructor
 * */

(function () {
    angular.module('PnT_Portal-user', [])
        .controller('UserDetailController', function ($scope, $routeParams, $location, UserService, appSetting) {
            if ($routeParams._id) {
                var user = _.find($scope.users, {_id: $routeParams._id});

                $scope.user = user;
                $scope.userImageUrl = 'http://placehold.it/450x350/d9edf7?text=' + user.userName;
                $scope.deleteTraining = function (trainingId) {
                    UserService.unassignTraining(user._id, trainingId);
                };
            } else {
                $location.url(appSetting.virtualDir + '/training');
            }
        });
})();
