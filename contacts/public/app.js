angular.module('ContactsApp', ['ngRoute', 'ngResource', 'ngMessages', 'ngFileUpload'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/contacts', {
                controller: 'ListController',
                templateUrl: 'views/list.html'
            })
            .when('/contact/new', {
                controller: 'NewController',
                templateUrl: 'views/new.html'
            })
            .when('/upload', {
                controller: 'UploadController',
                templateUrl: 'views/upload.html'
            });

        $locationProvider.html5Mode(true);
    });