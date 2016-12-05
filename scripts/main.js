// Service Worker
if( 'serviceWorker' in navigator ) { //Checking whether Service worker is supported
	// Registration
	navigator.serviceWorker.register('/sw.js').then(function(registration) {
		console.log('Registration successful');
	}).catch(function(error) {
		console.log('Registration failed' + error);
	});
}


//Angular App initialization
var app = angular.module('port', ['ngMaterial', 'ngAnimate']);

//Confiurations
app.config(function($mdThemingProvider) {
  	$mdThemingProvider.theme('default')
    .accentPalette('blue');
});

//Main Controller
app.controller('main', function ($scope, $interval, $compile, $window, $sce) {
	$scope.gridLay = true;
	
	//For scrolling Adjectives
	$scope.counter = 0;
	$scope.adjective = ["A Web Developer", "A Programmer", "Google Play Rising Star", "Loves OpenSource", "A Linux Admin", "Elon Musk Fan", "Philomath", "Tech Enthusiast"];
	$interval(function() { 
		if ($scope.counter < 7) {
			$scope.counter++;
		} else {
			$scope.counter = 0;
		}
	}, 5000);

	//Trusting urls using SCE
	$scope.trust = function(url) {
		$sce.trustAsUrl(url);
	};

	//Recompiling the DOM on page loads through PJAX
	$scope.refresh = function() {
		$scope.target = angular.element(document).find('md-content');
		$compile($scope.target.contents())($scope);
	};

	$scope.show = function($event) {
		$scope.gridLay = false;
	}

	//Navigating to external locations
	$scope.go = function (dest) {
		$window.location.href = $sce.trustAsResourceUrl(dest);
	}
});


// Controller for share feature
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


// Directive Declarations
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
		template: "<div style='background: #F3F3F3; text-align: center; float: {{pos}}; margin: {{margin}}'>" + 
					"<img ng-src='{{source}}' alt='{{alt}}' width={{width}} height={{height}}/>"+
					"<div class='md-caption'> {{alt}}</div> "+
					"</div>",
		scope: {
			source: '@',
			width: '@',
			pos: '@',
			alt: '@'
		},
		link: function(scope) {
			if(scope.pos == "left") {
				scope.margin = "0 24px 24px 0";
			} else if(scope.pos == "right") {
				scope.margin = "0 0 24px 24px";
			} else {
				scope.margin = "24px 0 0 24px";
			}
    	},
	}
});