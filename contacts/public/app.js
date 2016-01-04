/*add user-defined modules here as dependency here for app.*/

angular.module('PnT_Portal', ['ngRoute', 'ngResource', 'ngMessages', 'ngFileUpload', 'PnT_Portal-contact', 'PnT_Portal-training'])
    .constant('appSetting', {virtualDir: '', serverPort: '3000'})
    //.constant('appSetting', { virtualDir: '/node/contacts/server.js', serverPort: '80' }) // deploy IIS config
    .config(function ($routeProvider, $locationProvider, appSetting) {
        $routeProvider
            .when(appSetting.virtualDir + '/contacts', {
                controller: 'ListController',
                templateUrl: 'components/contact/list.html'
            })
            .when(appSetting.virtualDir + '/contact/new', {
                controller: 'NewController',
                templateUrl: 'components/contact/new.html'
            })
            .when(appSetting.virtualDir + '/training', {
                controller: 'CourcesController',
                templateUrl: 'components/training/list.html'
            })
            .when(appSetting.virtualDir + '/training/upload', {
                controller: 'UploadController',
                templateUrl: 'components/training/upload.html'
            })
            .when(appSetting.virtualDir + '/training/cart', {
                controller: 'CartController',
                templateUrl: 'components/training/cart.html'
            })
            /* route to training list as default.*/
            .when(appSetting.virtualDir + '/', {
                redirectTo: "/training"
            });

        $locationProvider.html5Mode(true);
    });