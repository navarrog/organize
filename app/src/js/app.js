var app = angular.module('organize', []);

app.controller('mainController', ['$scope', function($scope) {
  $scope.click = false;

  $scope.manipulateForm = function(boolean) {
    $scope.click = boolean;
    console.log(boolean);
  }
}]);
