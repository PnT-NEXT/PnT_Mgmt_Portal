/*add user-defined modules here as dependency here for app.*/

angular.module('PnT_Portal', ['ngRoute', 'ngResource', 'ngMessages', 'ngFileUpload', 'PnT_Portal-contact', 'PnT_Portal-training', 'PnT_Portal-user'])
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
                controller: 'TrainingsController',
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
            .when(appSetting.virtualDir + '/training/assign', {
                controller: 'AssignmentController',
                templateUrl: 'components/training/assign.html'
            })
            .when(appSetting.virtualDir + '/user/detail', {
                controller: 'UserDetailController',
                templateUrl: 'components/user/detail.html'
            })
            .when(appSetting.virtualDir + '/training/detail', {
                controller: 'TrainingDetailController',
                templateUrl: 'components/training/trainingDetail.html'
            })
            /* route to training list as default.*/
            .when(appSetting.virtualDir + '/', {
                redirectTo: "/training"
            });

        $locationProvider.html5Mode(true);
    })

    .run(function ($rootScope, UserService, TrainingService) {
        /* set page title on route changes*/
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.originalPath.replace(/\//g, '-').toUpperCase();
        });

        TrainingService.initialize();
        UserService.initialize();
    });