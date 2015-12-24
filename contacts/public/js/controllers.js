angular.module('ContactsApp')
    .controller('ListController', function($scope, Contact, $location) {
        $scope.contacts = Contact.query();
        $scope.fields = ['firstName', 'lastName'];

        $scope.sort = function(field) {
            $scope.sort.field = field;
            $scope.sort.order = !$scope.sort.order;
        }

        $scope.sort.field = 'firstName';
        $scope.sort.order = false;

        $scope.show = function(id) {
            $location.url('/Contact/' + id);
        }
    })
    .controller('NewController', function($scope, Contact, $location) {
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

        $scope.save = function() {
            if ($scope.newContact.$invalid) {
                $scope.$broadcast('record:invalid');
            } else {
                $scope.contact.$save();
                $location.url('/contacts');
            }
        }
    })
    .controller('UploadController', function($scope, Upload, $timeout) {
        $scope.upload = function(file) {
            file.upload = Upload.upload({
                url: 'http://localhost:3000/uploadFile',
                data: {
                    file: file
                }
            });

            file.upload.then(function(response) {
                $timeout(function() {
                    file.result = response.data;
                })
            }, function(response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function(evt) {
                file.progress = Math.min(100, parseInt(100.0 + evt.loaded / evt.total));
            });
        };
    });