//Main JS - mukilane.github.io
// Service Worker
// Adapted from https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
if ('serviceWorker' in navigator) { // If Service worker feature is available in the browser
	navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
	/*registration.showNotification('Vibration Sample', { // Notification with Vibration
	body: 'Buzz! Buzz!',
	vibrate: [200, 100, 200, 100, 200, 100, 200],
	tag: 'vibration-sample'
	});*/
		// Get a handle for the toast service 
		var toaster = angular.element(document.getElementById('ctrl')).injector().get('Toast');
		registration.onupdatefound = function() { //When SW is changed
			// The updatefound event implies that reg.installing is set; see
			// https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event

			// Get the state of the service worker
			var installingWorker = registration.installing;
			// Track the service worker of any changes
			installingWorker.onstatechange = function() {
				switch (installingWorker.state) {
					case 'installed':
						if (navigator.serviceWorker.controller) {
							console.log('[SW] Registration successful');
							// Any old content will be purged and new content will be added to the cache
							toaster('New content available. Refresh to see', 'refresh');
							// Refresh is done to load overcome the network first strategy.
							// Content will be loaded from the cache only the second time
							// The content won't be offline ready at the first visit.
						} else {
							// If controller is null, then caching is complete
							toaster('Content cached for offline use', 'ok');
						}
						break;
					case 'redundant':
						console.error('[SW] The installing service worker became redundant.');
						break;
				}
			};
		};
	}).catch(function(e) {
		console.error('[SW] Error during service worker registration:', e);
	});
}
//Angular App initialization
var app = angular.module('port', ['ngMaterial', 'ngAnimate']);
// Angular Confiurations
app.config(function($mdThemingProvider, $interpolateProvider, $httpProvider, $compileProvider) {
	//Overriding Default theme
	$mdThemingProvider.theme('default')
		.accentPalette('blue');

	// Overriding Interpolation symbols to avoid conflict with Liquid tags
	$interpolateProvider.startSymbol('{*');
	$interpolateProvider.endSymbol('*}');

	// Performance configurations
	//Handling simultaneous requests and 'apply' in the next digest cycle
	$httpProvider.useApplyAsync(true);

	// Disable debug info - removes ng-scope and ng-isolate scope classes
	$compileProvider.debugInfoEnabled(false);
	// Disable checking for css class directives
	$compileProvider.cssClassDirectivesEnabled(false);
	// Disable checking for comment directives
	$compileProvider.commentDirectivesEnabled(false);
});


//Main Controller
app.controller('main', function ($scope, $interval, $compile, $window, $sce, $mdToast) {

	// Whether the main grid is painted
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

	//Listening to network changes
	$window.addEventListener("offline", function() {
	  $scope.swToast("You're Offline. Serving from cache!", false);
        $window.addEventListener('online', function(e) {
          $scope.swToast("You're Online now !", 'ok');
        }, false);
	}, false);

	// Trusting urls using SCE
	$scope.trust = function(url) {
		// Returns a trusted url
		$sce.trustAsUrl(url);
	};
	
	// Recompiling the DOM on page loads through PJAX
	$scope.refresh = function() {
		$scope.target = angular.element(document).find('md-content');
		$compile($scope.target.contents())($scope);
	};
	
	// Display the main grid after the painting completes
	$scope.show = function($event) {
		if($scope.gridLay == true) { // The first time the painting is done
			$scope.gridLay = false;
			if(navigator.onLine == false) {
				// Notify if user if offline and content is served from cache after first paint
				$scope.swToast("You're offline. Serving from cache!");
			}
		}
	};

	//Navigating to external locations
	$scope.go = function (dest) {
		$window.location.href = $sce.trustAsResourceUrl(dest);
	};
	// Toasts
	$scope.swToast = function(msg, action) {
		if (action != '') { // Whether the toast should show an action button
			$mdToast.show($mdToast.simple().textContent(msg).action(action).highlightAction(true))
			.then(function(response) {
				if ( response == 'ok' ) {
					switch (action) {
						case 'refresh':
							$window.location.reload();
							break;
						case 'ok':
							break;
					}
				}
			});
		} else {
			$mdToast.showSimple(msg);
			// or $mdToast.show($mdToast.simple().textContent(msg));
		}
	};
});

// Factory for displaying toasts
app.factory('Toast', ['$mdToast', function($mdToast) {
  return function(msg, action) {
   	if (action !== '') { // Whether the toast should show an action button
				$mdToast.show($mdToast.simple().textContent(msg).action(action).highlightAction(true))
				.then(function(response) {
					if ( response == 'ok' ) {
						switch (action) {
							case 'refresh':
								$window.location.reload();
								break;
							case 'ok':
								break;
						}
					}
				});
			} else {
				$mdToast.showSimple(msg);
				// or $mdToast.show($mdToast.simple().textContent(msg));
			}
  };
}]);

// Controller for share feature
app.controller('shareCtrl', function ($scope, $mdDialog, $location, $mdToast) {
	$scope.copy = true;
	$scope.title = angular.element(window.document)[0].title;
	$scope.url = $location.absUrl();
	$scope.openShare = function(ev) {

		// Web Share API (April 2017) Origin Trial
		if(navigator.share !== undefined) {
			navigator.share({
				title: $scope.title, 
				text: $scope.title, 
				url: $scope.url
			})
			.then(() => $scope.toast('Thanks for sharing!'), 
				error => $scope.toast('Error in sharing.'));
	    return;
    }

		$mdDialog.show({
			templateUrl: '/assets/share-template.html',
			parent: angular.element(document.body), // Where the dialog should be appended
			targetEvent: ev,
			controller: () => this, // Controller for the dialog
			controllerAs: 'share',
			clickOutsideToClose:true,
		});
	};
	$scope.close = function() {
		$mdDialog.cancel();
	}
	$scope.toast = function(msg) {
		$mdToast.showSimple(msg);
	}
});

//Controller to invoke Panel
app.controller('ModalController', ModalController);

//Controller for the Panel itself
app.controller('ModalCtrl', ModalCtrl);

function ModalController($mdPanel) {
	this._mdPanel = $mdPanel;
}

//Fucntion to open the panel
ModalController.prototype.showPanel = function(dest) {
	var tmpl = '/project/' + dest + '.html';

	var position = this._mdPanel.newPanelPosition().absolute().center();

	var animation = this._mdPanel.newPanelAnimation()
	.withAnimation(this._mdPanel.animation.FADE);

	var config = {
		animation: animation,
		attachTo: angular.element(document.body),
		controller: ModalCtrl, //Controller for the panel
		controllerAs: 'ctrl',
		disableParentScroll: this.disableParentScroll,
		templateUrl: tmpl,
		hasBackdrop: true,
		panelClass: 'modal-container',
		position: position,
		trapFocus: true,
		zIndex: 150,
		clickOutsideToClose: true,
		escapeToClose: true,
		focusOnOpen: true
	};
	this._mdPanel.open(config);
};

function ModalCtrl(mdPanelRef) {
	this._mdPanelRef = mdPanelRef;
}

ModalCtrl.prototype.closePanel = function() {
	var panelRef = this._mdPanelRef;
	panelRef && panelRef.close().then(function() {
		angular.element(document.querySelector('.share')).focus();
		panelRef.destroy();
	});
};

// Directives Declaration
app.directive('tile', function() {
	return {
		restrict: 'E',
		transclude: true,
		template: "<div class='tile-wrap' style='background-image: url({{::image}}); opacity: {{::opacity}}; background-position: {{::pos}}; background-size: {{::size}}' ng-transclude></div>",
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
		template: "<div class='tile-wrap' style='background-image: url({{::image}}); opacity: {{::opacity}}; background-position: {{::pos}}; background-size: {{::size}}'><div class='image-tile' ng-transclude></div></div>",
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
		template: "<img ng-src='{{::source}}' style='opacity:{{::opacity}}; width: {{::width}};'/>",
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
		template: "<span class='tile-title' ng-transclude></span><br/><span style='opacity: 0.67'>{{::tag}}</span>",
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
		template: 	"<div layout='row' layout-align='space-between center'>" +
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
		template: 	"<div style='background: #F3F3F3; text-align: center; float: {{::pos}}; margin: {{::margin}}'>" +
					"<img ng-src='{{::source}}' alt='{{::alt}}' width={{::width}} height={{::height}}/>"+
					"<div class='md-caption'> {{::alt}}</div> "+
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

//PJAX events listener
app.directive('pjaxNav', function(){ 
	return {
		restrict: 'A', 
		link: function(scope, elem) {
			elem.bind('beforeSend', function(e) {
				scope.trust(e.data.url);
        var toAnim = angular.element(document.getElementById('content'));
        toAnim.removeClass('fade-up');
        toAnim.addClass('fade-down');
			});
			elem.bind('success', function(e) {
				scope.refresh();
        var toAnim = angular.element(document.getElementById('content'));
        toAnim.removeClass('fade-down');
        toAnim.addClass('fade-up');
			});
			elem.bind('error', function() {
				pjax.invoke('/404/', 'main');
			});
		}
	};
});