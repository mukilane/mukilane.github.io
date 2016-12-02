var app = angular.module('port', ['ngMaterial', 'ngAnimate']);

app.config(function($mdThemingProvider) {
  	$mdThemingProvider.theme('default')
    .accentPalette('blue');
});

app.controller('main', function ($scope, $interval, $compile, $window, $sce) {
	$scope.gridLay = true;
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

	$scope.show = function($event) {
		$scope.gridLay = false;
	}

	$scope.go = function (dest) {
		$window.location.href = $sce.trustAsResourceUrl(dest);
	}
});

app.controller('shareCtrl', function ($scope, $mdDialog, $location) {
	$scope.copy = true;
	$scope.title = angular.element(window.document)[0].title;
	$scope.url = $location.absUrl();
	$scope.openShare = function(ev) {
		$mdDialog.show({
		  templateUrl: '/assets/share-template.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  controller: () => this,
		  controllerAs: 'ctrl',
		  clickOutsideToClose:true,
		});
	};
	$scope.close = function() {
		$mdDialog.cancel();
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