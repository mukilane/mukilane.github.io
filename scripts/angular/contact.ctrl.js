// Controller for Contact page
app.controller("ContactCtrl", function($scope) {
	$scope.showForm = false;
	$scope.data = {
		email: "",
		password: ""
	};
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
		  // An error happened.	
		});
	}
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    
	    $scope.showForm = true;
	    var displayName = user.displayName;
	    var email = user.email;
	    var emailVerified = user.emailVerified;
	    var photoURL = user.photoURL;
	    var isAnonymous = user.isAnonymous;
	    var uid = user.uid;
	    var providerData = user.providerData;
	    console.log(displayName, email, photoURL);

	  } else {
	    // User is signed out.
	    // ...
	  }
});
});