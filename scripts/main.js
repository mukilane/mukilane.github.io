var app = angular.module('port', ['ngMaterial', 'ngRoute']);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .accentPalette('blue');
});

app.controller('main', function ($scope, $interval) {
	$scope.counter = 0;
	$scope.adjective = ["A Web Developer", "A Programmer", "Google Play Rising Star", "Loves OpenSource", "A Linux Admin", "Elon Musk Fan", "Philomath", "Tech Enthusiast"];
	$interval(function() { 
		if ($scope.counter < 7) {
			$scope.counter++;
		} else {
			$scope.counter = 0;
		}
	}, 5000);
});

app.directive('tileImage', function () {
    return {
      restrict: 'E',
      template: "<img src='{{source}}' style='opacity:{{opacity}}; width: {{width}};'/>",
      scope: {
        source: '@',
        opacity: '@',
        width: '@',
      }
    }
  });

app.directive('tileHeader', function() {
	return {
		restrict: 'E',
		transclude: true,
		template: "<span class='tile-title' ng-transclude></span><br/><span style='opacity: 0.67'>{{tag}}</span>",
		scope: {
			name: '@',
			tag: '@'
		}
	}
});