// Controller for feeback form
app.controller('feedback', function ($scope, $firebaseObject, $firebaseAuth, Dialog) {
	"ngInject";
	var auth = $firebaseAuth();
	var ref = firebase.database().ref("feedback");
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
    	$scope.data = $firebaseObject(ref.push());
    }).catch(function(error) {
    	console.log("Error occured during sending");
    });
  };
  $scope.thumbs = function(e) {
  	$scope.data = $firebaseObject(ref.push());
  	$scope.data.$save().then(function() {
  		
  	});
  }
  $scope.sendMsg = function() {
    $scope.data.$save().then(function() {
			console.log('Feedback Sent');
			Dialog.close();
    }).catch(function(error) {
    	console.log('Error!');
    });
  };
});