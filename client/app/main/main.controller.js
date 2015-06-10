'use strict';

angular.module('heliosApp', [
    'smart-table', 'ngRoute', 'daterangepicker', 'angularjs-dropdown-multiselect'])
    .controller('MainCtrl', function ($scope, $http) {
        $scope.date = {startDate: moment().startOf('day').subtract(1, 'days'), endDate: moment().startOf('day')};
        $scope.awesomeThings = [];

        $http.get('/api/things/?startDate=' + $scope.date.startDate + '&endDate=' + $scope.date.endDate).success(function (awesomeThings) {
            $scope.data = awesomeThings[0].ByDay;
            console.log($scope.data);
        });
        $scope.rowCollectionDisplay = [].concat($scope.awesomeThings);

        $scope.itemsByPage = 5;

        //Watch for date changes
        $scope.$watch('date', function (newDate) {
            console.log('New date set: ', newDate);
            $http.get('/api/things/?startDate=' + moment($scope.date.startDate) + '&endDate=' + moment($scope.date.endDate)).success(function (awesomeThings) {
                $scope.data = awesomeThings[0].ByDay;
                console.log($scope.data);
            });
            $scope.rowCollectionDisplay = [].concat($scope.awesomeThings);
        }, false);

        // multi-select start

        $scope.dimModel = [];
        $scope.dimData = [
            {id: 1, label: "Campaign ID"},
            {id: 2, label: "Placement ID"},
            {id: 3, label: "Offer ID"}];

        $scope.dimSettings = {
            smartButtonMaxItems: 3
        };

    });


/*
 $filter('date')(date, format, timezone)
 */
