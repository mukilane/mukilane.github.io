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