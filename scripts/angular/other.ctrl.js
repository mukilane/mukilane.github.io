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