angular.module('ContactsApp')
    .factory('Contact', function ($resource) {
    	// TODO: is the standard ways of following url should be: '/api/contact/:id'?
        return $resource('/api/contact:id', {id: '@id'},
            {
                'update': {method: 'PUT'}
            });
    });