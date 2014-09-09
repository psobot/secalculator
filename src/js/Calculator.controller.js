var calculator = angular.module('calculator', ['fcsa-number']);

calculator.controller('CalculatorController', function ($scope) {
  $scope.data = data;

  $scope.applyDefault = function(field, _default) {
    field.value = Math.round(_default.value * 100) / 100;
  };

  $scope.applyPreset = function(term, preset) {
    _.forEach(preset.values, function(value, attr) {
      var field = _.find(term.fields, {id: attr});
      field.value = Math.round(value * 100) / 100;
    });
  };

  $scope.save = function() {
    var values = _.map($scope.data.years, function(terms) {
      return _.map(terms, function(term) {
        return _.map(term.fields, function(field) {
          return parseFloat(field.value);
        });
      });
    });
    return JSON.stringify(values);
  };

  $scope.load = function(json) {
    var local = _.clone($scope.data);
    try {
      var values = JSON.parse(json);

      _.forEach(local.years, function(terms, i) {
        _.forEach(terms, function(term, j) {
          _.forEach(term.fields, function(field, k) {
            field.value = parseFloat(values[i][j][k]);
          });
        });
      });

      $scope.data = local;
    } catch (e) {
      console.log("Could not load data: ", e);
    }
  };

  if (window.location.hash) {
    $scope.load(window.location.hash.slice(1));
  }

  $scope.$watch('data', function(newValue) {
    window.location.hash = $scope.save();
  }, true);
});