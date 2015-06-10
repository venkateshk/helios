'use strict';

angular.module('heliosApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'smart-table',
    'daterangepicker',
    'angularjs-dropdown-multiselect'
])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    });
