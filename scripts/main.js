var app = angular.module('port', ['ngMaterial', 'ngAnimate']);

app.config(function($mdThemingProvider) {
  	$mdThemingProvider.theme('default')
    .accentPalette('blue');
});

app.controller('main', function ($scope, $interval, $compile, $window, $sce) {
	$scope.counter = 0;
	$scope.adjective = ["A Web Developer", "A Programmer", "Google Play Rising Star", "Loves OpenSource", "A Linux Admin", "Elon Musk Fan", "Philomath", "Tech Enthusiast"];
	$interval(function() { 
		if ($scope.counter < 7) {
			$scope.counter++;
		} else {
			$scope.counter = 0;
		}
	}, 5000);

	$scope.trust = function(url) {
		$sce.trustAsUrl(url);
	};

	$scope.refresh = function() {
		$scope.target = angular.element(document).find('md-content');
		$compile($scope.target.contents())($scope);
	};

	$scope.go = function (dest) {
		$window.location.href = $sce.trustAsResourceUrl(dest);
	}
});

app.directive('tile', function() {
	return {
		restrict: 'E',
		transclude: true,
		template: "<div class='tile-wrap' style='background-image: url({{image}}); opacity: {{opacity}}; background-position: {{pos}}; background-size: {{size}}' ng-transclude></div>",
		scope: {
			image: '@',
			opacity: '@',
			pos: '@',
			size: '@'
		}
	}
});

app.directive('imageTile', function() {
	return {
		restrict: 'E',
		transclude: true,
		template: "<div class='tile-wrap' style='background-image: url({{image}}); opacity: {{opacity}}; background-position: {{pos}}; background-size: {{size}}'><div class='image-tile' ng-transclude></div></div>",
		scope: {
			image: '@',
			opacity: '@',
			pos: '@',
			size: '@'
		}
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

app.directive('tileFooter', function() {
	return {
		restrict: 'E',
		transclude: true,
		template: "<div layout='row' layout-align='space-between center'>" + 
					"<h3 class='md-subhead' ng-transclude></h3>" + 
					"<span><i class='material-icons'>chevron_right</i>" + 
					"</div>",
		scope: {
			external: '@'
		}
	}
});

app.directive('articleImage', function() {
	return {
		restrict: 'E',
		template: "<div style='background: #333;'>" + 
					"<img ng-src='{{source}}' alt='{{alt}}' width={{width}} height={{height}}/>"+
					"</div>",
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