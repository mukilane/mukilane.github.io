var app = angular.module('port', ['ngMaterial', 'ngRoute']);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .accentPalette('blue');
});

app.controller('main', function ($scope, $element, $mdInkRipple) {
});