angular.module('PnT_Portal-contact', ['ngRoute'])
    .controller('ListController', function ($scope, Contact, $location, appSetting) {
        $scope.contacts = Contact.query();
        $scope.fields = ['firstName', 'lastName'];

        $scope.sort = function (field) {
            $scope.sort.field = field;
            $scope.sort.order = !$scope.sort.order;
        }

        $scope.sort.field = 'firstName';
        $scope.sort.order = false;

        $scope.show = function (id) {
            $location.url(appSetting.virtualDir + '/Contact/' + id);
        }
    })

    .controller('NewController', function ($scope, Contact, $location, appSetting) {
        $scope.contact = new Contact({
            firstName: ['', 'text'],
            lastName: ['', 'text'],
            email: ['', 'email'],
            homePhone: ['', 'tel'],
            cellPhone: ['', 'tel'],
            birthday: ['', 'date'],
            webSite: ['', 'url'],
            address: ['', 'text']
        });

        $scope.save = function () {
            if ($scope.newContact.$invalid) {
                $scope.$broadcast('record:invalid');
            } else {
                $scope.contact.$save();
                $location.url(appSetting.virtualDir + '/contacts');
            }
        }
    })

    .factory('Contact', function ($resource, appSetting) {
        // TODO: is the standard ways of following url should be: '/api/contact/:id'?
        return $resource(appSetting.virtualDir + '/api/contact:id', {id: '@id'},
            {
                'update': {method: 'PUT'}
            });
    });
