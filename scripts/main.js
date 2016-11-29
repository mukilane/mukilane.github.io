var app = angular.module('port', ['ngMaterial']);

app.config(function($mdThemingProvider) {
  	$mdThemingProvider.theme('default')
    .accentPalette('blue');
});
app.config(function($locationProvider) {
	$locationProvider.html5Mode(true);
});

app.controller('main', function ($scope, $interval, $compile, $window) {
	$scope.counter = 0;
	$scope.adjective = ["A Web Developer", "A Programmer", "Google Play Rising Star", "Loves OpenSource", "A Linux Admin", "Elon Musk Fan", "Philomath", "Tech Enthusiast"];
	$interval(function() { 
		if ($scope.counter < 7) {
			$scope.counter++;
		} else {
			$scope.counter = 0;
		}
	}, 5000);

	$scope.refresh = function() {
		$scope.target = angular.element(document).find('md-content');
		$compile($scope.target.contents())($scope);
	};

	/*$scope.goto = function(dest) {
		$.get(dest , function( response ) {
		 	var elem  = $(response).filter('#main');
			$scope.target = angular.element(document).find('md-content');
			$scope.target.fadeOut(750, function() {
				$scope.target.html(elem);
				$location.path(dest);
				$compile($scope.target.contents())($scope);
				$scope.target.fadeIn(500);
			});
		});	
	};*/

	$scope.go = function (dest) {
		$window.location.href = dest;
	}
});


app.directive('tileImage', function () {
    return {
      restrict: 'E',
      template: "<img ng-src='{{source}}' style='opacity:{{opacity}}; width: {{width}};'/>",
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

app.directive('articleImage', function() {
	return {
		restrict: 'E',
		template: "<div style='background: #333;'><img ng-src='{{source}}' alt='{{alt}}' width={{width}} height={{height}}/></div>",
		scope: {
			source: '@',
			width: '@',
			height: '@',
			alt: '@'
		}
	}
});

app.directive('postHeader', function() {
	return {
		restrict: 'E',
		transclude: true,

	}
});