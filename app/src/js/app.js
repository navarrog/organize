var app = angular.module('organize', []);

app.controller('mainController', ['$rootScope', '$scope', function($rootScope, $scope) {
  $scope.inserirHistorico = function() {
    $scope.gramasTotais = $scope.numero * $scope.unidade;
    console.log($scope.gramasTotais, $scope.alimento);
  }

  $scope.historico = [
    {
      'data': '26/04/17',
      'alimento': '50g de Maçã',
      'cho': '20g',
    },
    {
      'data': '26/04/17',
      'alimento': '1 copo de Leite desnatado',
      'cho': '10g',
    },
    {
      'data': '26/04/17',
      'alimento': '4 colheres de sopa de Arroz',
      'cho': '20g',
    }
  ];

  $scope.$on('alimentosCarboidratos', function(event, args) {
    $scope.calculaCarboidratos(args.data);
  });

  $scope.carboidratosResultado = 0;

  $scope.calculaCarboidratos = function(carboidratos) {
    $scope.gramasTotais = $scope.numero * $scope.unidade;
    $scope.carboidratosResultado = carboidratos * $scope.gramasTotais;
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

app.directive('autoComplete', ['$rootScope', function($rootScope) {
  return {
    restrict: 'E',
    link: function() {
      var defaultAutoComplete = new autoComplete({
        selector: 'input[name="alimento"]',
        minChars: 1,
        source: function(term, suggest){
            term = term.toLowerCase();
            $rootScope.choices = [
              {
                'alimento': 'Maçã',
                'carboidratos': 0.14,
              },
              {
                'alimento': 'Leite desnatado',
                'carboidratos': 0.05
              },
              {
                'alimento': 'Arroz',
                'carboidratos': 0.28
              },
              {
                'alimento': 'Manga',
                'carboidratos': 0.15,
              },
              {
                'alimento': 'Mel',
                'carboidratos': 0.82
              }
            ];
            var matches = [];
            for (i=0; i<$rootScope.choices.length; i++)
                if (~$rootScope.choices[i]['alimento'].toLowerCase().indexOf(term)) matches.push($rootScope.choices[i]['alimento']);
            suggest(matches);
        },
        onSelect: function(e, term, item){
          $rootScope.alimentosCarboidratos = "";

          for (i=0; i<$rootScope.choices.length; i++) {
            if(term == $rootScope.choices[i]['alimento']) {
              $rootScope.$broadcast('alimentosCarboidratos', {data: $rootScope.choices[i]['carboidratos']});
            }
          }
        }
      });
    }
  }
}]);
