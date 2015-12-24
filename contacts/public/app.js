/*add user-defined modules here as dependency here for app.*/

angular.module('PnT_Portal', ['ngRoute', 'ngResource', 'ngMessages', 'ngFileUpload', 'PnT_Portal-contact', 'PnT_Portal-training'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/contacts', {
                controller: 'ListController',
                templateUrl: 'components/contact/list.html'
            })
            .when('/contact/new', {
                controller: 'NewController',
                templateUrl: 'components/contact/new.html'
            })
            .when('/upload', {
                controller: 'UploadController',
                templateUrl: 'components/training/upload.html'
            });

        $locationProvider.html5Mode(true);
    });