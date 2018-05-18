// Main JS - mukilane.github.io
// Firebase initialization
var config = {
    apiKey: "AIzaSyD8Jyc_TJwBwAwmkN8ETzUXKPWLiXGsEn0",
    authDomain: "mukilane.github.io",
    databaseURL: "https://mukil-elango.firebaseio.com",
    projectId: "mukil-elango",
    storageBucket: "mukil-elango.appspot.com",
    messagingSenderId: "771554923359"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
// Angular App initialization
var app = angular.module('port', ['ngMaterial', 'ngAnimate', 'firebase']);
// Angular Confiurations
app.config(function($mdThemingProvider, $interpolateProvider, $httpProvider, $compileProvider, $locationProvider, $controllerProvider) {
	"ngInject";
	// Reference for Controller Provider for Dynamic(Lazy) dependency injection
	app.controllerProvider = $controllerProvider;
	// Overriding Default theme
	$mdThemingProvider.theme('default')
		.accentPalette('blue');

	// Browser Color   
	$mdThemingProvider.enableBrowserColor({
		theme: 'default', 
		palette: 'background', 
		hue: '50'
  	});

	// Overriding Interpolation symbols to avoid conflict with Liquid tags
	$interpolateProvider.startSymbol('{*');
	$interpolateProvider.endSymbol('*}');

	// Performance configurations	
	// Deferring digest cycles for multiple http requests
	// Handling simultaneous requests and '$apply' in the next digest cycle
	$httpProvider.useApplyAsync(true);

	// Disable debug info - removes 'ng-scope' and 'ng-isolate' classes
	$compileProvider.debugInfoEnabled(false);
	// Disable checking for css class directives
	$compileProvider.cssClassDirectivesEnabled(false);
	// Disable checking for comment directives
	$compileProvider.commentDirectivesEnabled(false);

	$locationProvider.hashPrefix('');
});
angular.module('port')
.controller('Assistant', function($scope, Conversation, $timeout) {
	"ngInject";
    var assistant = new ApiAi.ApiAiClient({accessToken: "bd52bb26359c45ceb2da599fe21a94c9" });
	$scope.result = "";
	$scope.query = "";
	$scope.send = ()=> {
		if($scope.query !== "") {
			assistant.textRequest($scope.query)
			.then((response) => {
				$scope.parse(response.result);
				$scope.query = "";
			}).catch((error) => console.log(error));
		}
	};

	$scope.parse = (result) => {
		switch(result.action) {
			case "portfolio":
				Conversation("Transporting you to my portfolio");
				$timeout(pjax.invoke('/portfolio/', 'main'), 2000);
				break;
			case "resume":
				Conversation("Opening my resume");
				$timeout(window.open("https://goo.gl/zajpYF", "_blank"), 2000);
				break;
			case "navigate":
				Conversation("Transporting!")
				$timeout($scope.transport(result.parameters.page), 2000);
				break;
			case "smalltalk.greetings.bye":
				Conversation(result.fulfillment.speech);
				$scope.showAssist = false;
				break;
			case "smalltalk.agent.acquaintance":
				Conversation("I'm Mukil. Know more about me here");
				$timeout($scope.transport('about'), 1000);
				break;
			case "blog.newposts":
				Conversation(result.fulfillment.speech);
				$timeout($scope.transport('blog'), 1000);
				break;
			default:
				Conversation(result.fulfillment.speech);
		}
	}

	$scope.transport = (page) => {
		var list = ['blog', 'about', 'portfolio', 'contact', 'certificates', 'home'];
		if(list.indexOf(page) !== -1) {
			let dest = '/' + page + '/' ;
			if (page === 'home') { dest = '/'; }
			pjax.invoke(dest, 'main');
		} else {
			Conversation('Sorry, the page does not exist');
		}
	}

});
// Controller for Contact page
app.controller("ContactCtrl", function($scope, Panel, ContactService) {
	
	$scope.showForm = false;
	$scope.isNewForm = true;
	$scope.data = {
		email: "",
		password: ""
	};
	$scope.user = {};
	$scope.createUser = () => {
		firebase.auth().createUserWithEmailAndPassword($scope.data.email, $scope.data.password)
			.catch(function(error) {
			  	var errorCode = error.code;
		  		var errorMessage = error.message;	  
			});
	}
	$scope.signIn = () => {
		firebase.auth().signInWithEmailAndPassword($scope.data.email, $scope.data.password)
			.catch(function(error) {
			  	var errorCode = error.code;
		  		var errorMessage = error.message;
			});
	}
	$scope.signout = () => {
		firebase.auth().signOut().then(function() {
		  	$scope.showForm = false;
		}).catch(function(error) {
		  // An error happened.	S
		});
	}
	$scope.newForm = () => {
		Panel('/assets/contactform');
		ContactService.setForm(false); // New Form
	}
	$scope.existingForm = () => {
		Panel('/assets/contactform');
		ContactService.setForm(true); 
	}
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $scope.showForm = true;
	    $scope.user = user;
	    ContactService.isNewForm().then(data => $scope.isNewForm = data);
	  } else {
	    // User is signed out.
	  }
	});
});

app.controller('ContactFormCtrl', function($scope, ContactService, $timeout, Toast) {
	$scope.existingForm = ContactService.useExistingForm();
	$scope.forms = [];
	$scope.selectedForm = {};
	ContactService.getForms().then((data) => $scope.forms = data );
	$scope.selectForm = () => {
		console.log($scope.selectedForm.id);
		ContactService.selectForm($scope.selectedForm.id);
	}
	$scope.submit = (close) => {
		ContactService.update($scope.selectedForm)
			.then(function() {
				console.log("set out");
				Toast("Done. I'll reply soon.")
				close();
			});
	}
	$scope.delete = (close) => {
		ContactService.deleteForm()
			.then(() => {
				console.log("Form deleted").
				Toast("Form deleted.");
				close();
			}).catch((error) => {
				console.log("Error in deleting the form");
				Toast("Error deleting the form.");
				close();
			});
	}
});

app.service('ContactService', function($timeout) {
	var selectedForm = null;
	var doc = {};
	var flag = true;
	var user = null;
	var ref = null;
	var existingForm = false;
	var forms = [];
	var _isNewForm = true;
	var useExistingForm = function() {
		return existingForm;
	};
	var getForms = function() {
		forms = [];
		return ref.collection('forms').get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				forms.push(doc.data());
			});
			return forms;
		});
	}
	var isNewForm = function() {
		user = firebase.auth().currentUser;
		ref = firestore.collection('contacts').doc(user.uid);
		return ref.get()
			.then((_doc) => {
				doc = _doc.data();
				if(doc.formCount > 0) {
					_isNewForm = false;
					return false;
				} else {
					_isNewForm = true;
					return true;
				}
			});
	}

	var selectForm = function(id) {
		selectedForm = id;
		console.log(selectedForm);
	}

	var setForm = function(e) {
		_isNewForm = !e;
		existingForm = e; // Whether existing form is to be used : Bool
	}

	var update = function(data) {
		var docRef = null;
		var timestamp = new Date();
		if (_isNewForm) {
			docRef = ref.collection('forms').doc();
			doc.formCount = doc.formCount + 1;
			doc.formList.push({
				id: docRef.id,
				title: data.title,
				timestamp: timestamp
			});
		} else {
			docRef = ref.collection('forms').doc(selectedForm);
		}
		ref.set({
			formCount : doc.formCount,
			formList: doc.formList
		}, { merge: true }).then(function() { console.log("set"); });

		data.timestamp = timestamp;
		data.id = docRef.id;
		delete data.$$hashKey;
		delete data.$$mdSelectId;
		
		return docRef.set(data, {merge: true});
	} 

	var deleteForm = () => {
		if(selectedForm) {
			var _doc = {}; 
			docRef = ref.collection('forms').doc();
			_doc = doc.data()
			_doc.formCount = _doc.formCount - 1;
			docRef.set(_doc, {merge: true});
			
			return ref.collection('forms').doc(selectedForm).delete();
		}
	}
	return {
		isNewForm: isNewForm,
		selectedForm: selectedForm,
		selectForm: selectForm,
		update: update,
		setForm: setForm,
		useExistingForm: useExistingForm,
		getForms: getForms,
		deleteForm: deleteForm
	}
});
// Controller for feeback form
app.controller('feedback', function ($scope, $firebaseObject, $firebaseAuth, Dialog) {
  "ngInject";
  var auth = $firebaseAuth();
  $scope.close = function() {
    Dialog.close();
  }
  $scope.showMsg = false;
  $scope.signIn = function() {
    $scope.showMsg = true;
      $scope.firebaseUser = null;
      // Anonymous Sign in
      auth.$signInAnonymously().then(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
      }).catch(function(error) {
        console.log("Error occured during sending");
      });
  };
  $scope.thumbs = function(e) {
    // $scope.data = $firebaseObject(ref.push());
    // $scope.data.$save().then(function() {
      
    // });
  }
  $scope.sendMsg = function() {
    firestore.collection("feedback").add({
      username: $scope.data.username,
      message: $scope.data.message,
      timestamp: new Date() 
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      Dialog.close();
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
  };
});
// Main Controller
app.controller('main', function ($scope, $interval, $window, Toast, $sce, Dialog) {
	"ngInject";
	// Whether the main grid is painted
	$scope.gridLay = true;
	
	$scope.showAssist = false;
	// Set theme using Local Storage 
	if(!localStorage.getItem('theme')) { 
		// Default Theme
		$scope.isDark = false;
		$scope.theme = { bg: 'grey-A100', footer: 'grey-A100'};
	} else {
		// Dark Theme
		$scope.isDark = true;
		$scope.theme = { bg: 'grey-800', footer: 'grey-700' };
	} 

	$scope.setDark = function(e) {
		$scope.isDark = e;
		if(e) {
			localStorage.setItem('theme', 'dark');	
			Toast("Dark theme activated", 'refresh');
		}
		else {
			localStorage.removeItem('theme');
			Toast("Light theme activated", 'refresh');
		}
	}

	$scope.isHomePage = () => {
		if(window.location.pathname === "/") return true;
		return false;
	}

	// Navigation 
	$scope.navigate = (page) => {
		pjax.invoke(page, 'main');
		$scope.hideHomeButton = $scope.isHomePage();
	}
	$scope.hideHomeButton = $scope.isHomePage();

	/*	var gridwatch = $scope.$watch('gridLay', () => {
		gridwatch();
	});*/

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
	  Toast("You're Offline. Serving from cache!", false);
        $window.addEventListener('online', function(e) {
          Toast("You're Online now !", 'ok');
        }, { once:true, capture:false });
	}, false);

	// Trusting urls using SCE
	$scope.trust = function(url) {
		// Returns a trusted url
		$sce.trustAsUrl(url);
	};
		
	// Display the main grid after the painting completes
	$scope.show = function($event) {
		if($scope.gridLay == true) { // The first time the painting is done
			$scope.gridLay = false;
			if(!navigator.onLine) {
				// Notify if user if offline and content is served from cache after first paint
				Toast("You're offline. Serving from cache!");
			}
		}
	};
	$scope.showDlg = function(ev) {
		Dialog.show('feedback', ev)
	}
	//Navigating to external locations
	$scope.go = function (dest) {
		$window.location.href = $sce.trustAsResourceUrl(dest);
	};

});
// Controller for Notifications
app.controller('notifications', function($scope, $firebaseObject, Toast) {
	"ngInject";
	$scope.isNotificationEnabled = false;

	// Store the state of notification permission in LocalStorage
	if(localStorage.getItem('isNotificationEnabled')) { 
		$scope.isNotificationEnabled = true;
	}

	$scope.setEnabled = () => {
		localStorage.setItem('isNotificationEnabled', 'true');
		$scope.isNotificationEnabled = true;
	};
	
	const messaging = firebase.messaging();

	$scope.enableNotifications = () => {
		messaging.requestPermission()
			.then(() => {
				Toast('Notifications are enabled');
				$scope.setEnabled();
				$scope.getToken();
			})
			.catch((err) => {
				console.log(err);
				Toast('Notifications blocked!. To enable, go to site settings.');
			});
	};
	
	$scope.getToken = () => {
		messaging.getToken()
			.then((currentToken) => {
				if(currentToken) {
					let tokens = [];
					// Add Tokens to Firestore
					firebase.firestore().collection("users").doc("data").get()
					.then(data => {
							tokens = data.data()['notificationTokens'];
							tokens.push(currentToken);
							firebase.firestore().collection("users").doc("data").update({
								'notificationTokens': tokens
							});
					});
				}
			})
	}
	// If a Push Notification is received when the app is active, display a Toast
	messaging.onMessage((payload) => Toast(payload));
});
// Controller for search
app.controller('search', function($scope, $firebaseObject) {
	"ngInject";
	$scope.posts = [];
	var ref = firebase.database().ref('data/posts').once('value').then(function(snapshot) {
  	var obj =  snapshot.val();
  	angular.forEach(obj, function(val) {
      $scope.posts.push(val);
    });
  });
});

// Controller for Share feature
app.controller('share', function($scope, Dialog, Toast, $mdMedia, $mdBottomSheet) {
	"ngInject";
	$scope.link = window.location.href;
	$scope.title = angular.element(window.document)[0].title;
	$scope.Toast = Toast;
	$scope.openShare = function(ev) {

		// If Web Share API is available, open native share dialog
		/*if(navigator.share !== undefined) {
			navigator.share({
				title: $scope.title, 
				text: $scope.title, 
				url: $scope.url
			}).then(
				() => Toast('Thanks for sharing!'), 
				error => Toast('Error in sharing.')
			);
	    return;
	  }*/
	  // Else if the device is mobile, open bottomsheet
	  if($mdMedia('xs') == true) {
		  $mdBottomSheet.show({
		  	templateUrl: '/assets/sharebtm-template.html',
		  	clickOutsideToClose: true,
		  	controller: 'share'
			});
			return;
	  }
	  // Else open default share dialog
		Dialog.show('share', ev);
	};
	$scope.closeShare = function() {
		Dialog.close();
	};
});

//Controller for Projects
app.controller('ProjectCtrl', ['Panel', '$scope', '$http', function (Panel, $scope, $http) {
	var baseUrl = location.protocol + "//" + location.host;
	$scope.show = function(dest) {
		Panel('/project/' + dest);
	}
	$scope.filter = "";
	$scope.categories = ['hardware', 'frontend', 'native'];
	$scope.projects = [];
	$http.get(baseUrl + '/assets/projects.json')
       .then((res) => {
          for(project in res.data) {
          	$scope.projects.push(res.data[project]);
          }
        });
}]);

// Controller for Blog posts
app.controller('BlogCtrl', function($scope, $http) {
	var baseUrl = location.protocol + "//" + location.host;
	$scope.posts = [];
	$scope.filter = "";
	$scope.categories = ['events'];
	$http.get(baseUrl + '/assets/posts.json')
		.then((response) => {
			for(post in response.data) {
				$scope.posts.push(response.data[post]);
			}
		});
	$scope.navigate = (index) => {
		pjax.invoke($scope.posts[index].url, 'main');
	};
});

// Controller for 100DaysOfCode
app.controller('HdocCtrl', function($scope, $http, $anchorScroll, $location) {
	$scope.scrollTo = (day) => {
		var hash = 'day' + day;
		if($location.hash() !== hash) {
			$location.hash(hash);
		} else {
			$anchorScroll();
		}
	}
});
// Directives Declaration
app.directive('calendar', function($mdSticky, $compile) {
    return {
      restrict: 'E',
      templateUrl: '/assets/calendar.html',
      link: function(scope,element) {
        $mdSticky(scope, element);
      }
    };
});

app.directive('tile', () => {
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

app.directive('imageTile', () => {
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

app.directive('tileImage', () => {
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

app.directive('tileHeader', () => {
	return {
		restrict: 'E',
		transclude: true,
		template: "<span class='tile-title' ng-transclude></span><br/><span style='opacity: 0.67; margin-top: 4px;'>{{::tag}}</span>",
		scope: {
			name: '@',
			tag: '@'
		}
	}
});

app.directive('tileFooter', () => {
	return {
		restrict: 'E',
		transclude: true,
		template: 	"<div layout='row' layout-align='space-between center'><span class='md-subhead' ng-transclude></span><span><i class='material-icons'>chevron_right</i></div>",
		scope: {
			external: '@'
		}
	}
});

app.directive('articleImage', () => {
	return {
		restrict: 'E',
		template: 	"<div style='background: #F3F3F3; text-align: center; float: {{::pos}}; margin: {{::margin}}; background: {{::bg}}'><img ng-src='{{::source}}' alt='{{::alt}}' width={{::width}} height={{::height}}/><div class='md-caption'> {{::alt}}</div></div>",
		scope: {
			source: '@',
			width: '@',
			pos: '@',
			alt: '@',
			bg: '@'
		},
	
		link: function(scope) {
			if(scope.pos == "left") {
				scope.margin = "0 24px 24px 0";
			} else if(scope.pos == "right") {
				scope.margin = "0 0 24px 24px";
			} else {
				scope.margin = "24px 0 24px 0";
			}
		},
	}
});

//PJAX events listener
app.directive('pjaxNav', ['$compile', function($compile){ 
	return {
		restrict: 'A', 
		link: function(scope, elem) {			
			elem.bind('beforeSend', function(e) {
				scope.trust(e.data.url);
				var toAnim = angular.element(document.getElementById('content'));
				toAnim.removeClass('fade-up');
				toAnim.addClass('fade-down');
				var title = angular.element(document.getElementsByClassName('banner'));
				title.removeClass('fade-right');
				title.addClass('fade-left');
			});
			elem.bind('success', function(e) {
				// Recompiling the DOM on page loads through PJAX
				$compile(elem.contents())(scope);
				var toAnim = angular.element(document.getElementById('content'));
				toAnim.removeClass('fade-down');
				toAnim.addClass('fade-up');
				var title = angular.element(document.getElementsByClassName('banner'));
				title.removeClass('fade-left');
				title.addClass('fade-right');
			});
			elem.bind('error', function() {
				pjax.invoke('/404/', 'main');
				$compile(elem.contents())(scope);
			});
		}
	};
}]);

// Shortcut event listener
app.directive('shortcut', ['$document', function($document) {
	return {
		restrict: 'A',
		controller: 'main',
		link: function(scope, elem, attr, ctrl) {
			$document.bind('keypress', function(event) {
				if (event.which == 47) {
					if(event.target.nodeName != 'INPUT') {
						scope.$apply(attr.shortcut);
						event.preventDefault();
					}
				}
			});
		} 
	}
}]);
// Factory for Assistant conversation
app.factory('Conversation', ['$mdToast', '$window', function($mdToast, $window) {
	return function(msg) {
		var toast = $mdToast.simple()
			.textContent(msg)
			.capsule(true)
			.parent(document.querySelectorAll(".assist-bar"))
			.hideDelay(4000)
			.toastClass("assist-toast")
			.position("top right");
		$mdToast.show(toast);
	};
  }]);

// Factory for displaying toasts
app.factory('Toast', ['$mdToast', '$window', function($mdToast, $window) {
  return function(msg, action) {
   	if (action !== '') { // Whether the toast should show an action button
   		var toast = $mdToast.simple()
	      .textContent(msg)
	      .action(action)
	      .highlightAction(true);
			$mdToast.show(toast).then(function(response) {
				if ( response == 'ok' ) {
					switch (action) {
						case 'refresh':
							$window.location.reload();
							break;
						case 'ok':
							$mdToast.hide();
							break;
					}
				}
			}, function(err) {
				angular.noop();
			});
		} else {
			$mdToast.showSimple(msg);
			// or $mdToast.show($mdToast.simple().textContent(msg));
		}
  };
}]);
// Factory for displaying Dialogs
app.factory('Dialog', ['$mdDialog', 'Toast' , function($mdDialog, Toast) {
	return {
		show : function(dlg, ev) { 
				$mdDialog.show({
					templateUrl: '/assets/' + dlg + '-template.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					controller: dlg,
					clickOutsideToClose: true
				});
		},
		close : function() {
			$mdDialog.cancel();
		}
	};
}]);
// Factory for displaying Panels
app.factory('Panel', ['$mdPanel', function($mdPanel) {
	// Controller for Panel instance
	/*@ngInject*/ function PanelCtrl(mdPanelRef) { 
		this.close = function() {
			mdPanelRef && mdPanelRef.close().then(function() {
				mdPanelRef.destroy();
			})
		} 
	}
	return function(dest) {
		this._mdPanel = $mdPanel;
		var tmpl = dest + '.html';
		var position = this._mdPanel.newPanelPosition().absolute().center();
		var animation = this._mdPanel.newPanelAnimation().withAnimation(this._mdPanel.animation.SLIDE);
		animation.openFrom({
			top: document.documentElement.clientHeight,
			left: 0
		});
		animation.closeTo({
			top: document.documentElement.clientHeight,
			left: 0
		});
		animation.duration({
			open: 500,
			close: 300
		});
		var config = {
			animation: animation,
			attachTo: angular.element(document.body),
			controller: PanelCtrl,
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
		}
}]);
// Filter for capitalizing 
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
// Service Worker Registration
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
							// Any old content will be purged and new content will be added to the cache
							toaster('New content available', 'refresh');
							// Refresh is done to load overcome the network first strategy.
							// Content will be loaded from the cache only the second time
							// The content won't be offline ready at the first visit.
						} else {
							// If controller is null, then it is the first visit, so first time caching is complete
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