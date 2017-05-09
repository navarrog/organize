var app = angular.module('organize', []);

app.controller('mainController', ['$scope', function($scope) {
  $scope.click = false;
  $scope.manipulateForm = function(boolean) {
    $scope.click = boolean;
    console.log('boolean');
  }
}]);

app.directive('glicemiaChart', function(){
  return {
    restrict: 'E',
    link: function() {
      var data = {
        labels: ['7h', '10h', '13h', '16h', '19h', '22h'],
        series: [
          [110, 90, 95, 93, 55, 113]
        ]
      };

      var options = {
        height: 320,
        lineSmooth: false,
        onlyInteger: true,
        fullWidth: true,
        high: 200,
        low: 0,

      };

      new Chartist.Line('.glicemia__chart', data, options);
    }
  }
});
