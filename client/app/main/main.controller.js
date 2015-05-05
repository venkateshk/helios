'use strict';

angular.module('heliosApp', [
    'smart-table', 'ngRoute'])
    .controller('MainCtrl', function ($scope, $http) {
        $scope.awesomeThings = [];

        $http.get('/api/things').success(function (awesomeThings) {
            $scope.data = awesomeThings[0].ByHour[0].Ercc;
            console.log($scope.data);
        });
        $scope.rowCollectionDisplay = [].concat($scope.awesomeThings);
    });
