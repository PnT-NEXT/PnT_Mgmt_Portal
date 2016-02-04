/*db.training columns:
 * _id, name, courseId, programType, duration, city, seat, cost, instructor
 * */

(function () {
    angular.module('PnT_Portal-training-detail', [])
        .controller('TrainingDetailController', function ($scope, $routeParams, $location, TrainingService, appSetting) {
            if ($routeParams._id) {
                

            } else {
                $location.url(appSetting.virtualDir + '/training');
            }
        });
})();
