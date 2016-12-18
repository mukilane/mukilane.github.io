// Service Worker
// Adapted from https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js

if ('serviceWorker' in navigator) { //If Service worker is available
  navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
  	console.log('Registration successful');
  	/*registration.showNotification('Vibration Sample', {
          body: 'Buzz! Buzz!',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: 'vibration-sample'
        });*/
    registration.onupdatefound = function() { //When SW is changed
      // The updatefound event implies that reg.installing is set; see
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
      var installingWorker = registration.installing;
      installingWorker.onstatechange = function() {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and the fresh content will 
              // have been added to the cache.
              angular.element(document.getElementById('ctrl')).scope().swToast('New content available. Refresh to see', true);
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a "Content is cached for offline use." message.
              angular.element(document.getElementById('ctrl')).scope().swToast('Content cached for offline use', false);
            }
            break;

          case 'redundant':
            console.error('The installing service worker became redundant.');
            break;
        }
      };
    };
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
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
app.controller('main', function ($scope, $interval, $compile, $window, $sce, $mdToast) {
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
		if(navigator.onLine == false) {
			$scope.swToast("You're offline. Serving from cache!");
		}
	};

	//Navigating to external locations
	$scope.go = function (dest) {
		$window.location.href = $sce.trustAsResourceUrl(dest);
	};

	// Toasts
	$scope.swToast = function(msg, refresh) {
    	if (refresh) {
      		$mdToast.show($mdToast.simple().textContent(msg).action('REFRESH').highlightAction(true))
      		.then(function(response) {
      			if ( response == 'ok' ) {
      				$window.location.reload();
      			}
			});
      	} else {
      		$mdToast.showSimple(msg);
      		// or $mdToast.show($mdToast.simple().textContent(msg));    	
      	}	
  	};


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
		  controllerAs: 'share',
		  clickOutsideToClose:true,
		});
	};
	$scope.close = function() {
		$mdDialog.cancel();
	}
});

app.controller('ModalController', ModalController);
app.controller('ModalCtrl', ModalCtrl);

function ModalController($mdPanel) {
	this._mdPanel = $mdPanel;
}

ModalController.prototype.showPanel = function(dest) {

	var tmpl = '/project/' + dest + '.html';

  var position = this._mdPanel.newPanelPosition()
      .absolute()
      .center();

  var animation = this._mdPanel.newPanelAnimation()
  .withAnimation(this._mdPanel.animation.FADE);  


  var config = {
  	animation: animation,
    attachTo: angular.element(document.body),
    controller: ModalCtrl,
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
    	angular.element(document.querySelector('.demo-button')).focus();
    	panelRef.destroy();
  	});
};

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