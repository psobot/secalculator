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
});