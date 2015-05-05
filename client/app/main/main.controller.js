'use strict';

angular.module('heliosApp', [
    'smart-table', 'ngRoute', 'daterangepicker'])
    .controller('MainCtrl', function ($scope, $http) {
        $scope.date = {startDate: moment().startOf('day').subtract(1, 'days'), endDate: moment().startOf('day')};
        $scope.awesomeThings = [];

        $http.get('/api/things/?startDate='+$scope.date.startDate+'&endDate='+$scope.date.endDate).success(function (awesomeThings) {
            $scope.data = awesomeThings[0].ByDay;
            console.log($scope.data);
        });
        $scope.rowCollectionDisplay = [].concat($scope.awesomeThings);

        //Watch for date changes
        $scope.$watch('date', function(newDate) {
            console.log('New date set: ', newDate);
            $http.get('/api/things/?startDate='+moment($scope.date.startDate)+'&endDate='+moment($scope.date.endDate)).success(function (awesomeThings) {
                $scope.data = awesomeThings[0].ByDay;
                console.log($scope.data);
            });
            $scope.rowCollectionDisplay = [].concat($scope.awesomeThings);
        }, false);
    });


/*
 $filter('date')(date, format, timezone)
 */
