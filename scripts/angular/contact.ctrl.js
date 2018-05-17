// Controller for Contact page
app.controller("ContactCtrl", function($scope, Panel, ContactService) {
	
	$scope.showForm = false;
	$scope.isNewForm = true;
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
	    // User is signed in.
	    
	    $scope.showForm = true;
	    var displayName = user.displayName;
	    var email = user.email;
	    var emailVerified = user.emailVerified;
	    var photoURL = user.photoURL;
	    var isAnonymous = user.isAnonymous;
	    var uid = user.uid;
	    var providerData = user.providerData;
	    ContactService.isNewForm().then(data => $scope.isNewForm = data);
	  } else {
	    // User is signed out.
	    // ...
	  }
	});
});

app.controller('ContactFormCtrl', function($scope, ContactService) {
	$scope.existingForm = ContactService.useExistingForm();
	$scope.contact = ContactService.data;

	// var user = firebase.auth().currentUser;
	// var ref = firestore.collection('contacts');
	// $scope.merge = false; // New Doc
	// if(user !== null) {
	// 	ref.doc(user.uid).get()
	// 		.then(doc => {
	// 			if(doc.exists) {
	// 				$scope.contact = doc.data();
	// 				$scope.merge = true; // Existing doc
	// 			} else {
	// 				console.log("No doc");
	// 			}
	// 		}).catch(error => {
	// 			console.log(error);
	// 		})
	// } else {
	// 	console.log("Not signed in");
	// }
	// $scope.contact = {};
	$scope.submit = () => {
		ContactService.update($scope.contact);
		// ref.doc(user.uid).collection('form').doc().set($scope.contact, { merge: $scope.merge })
		// 	.then(() => console.log("Done"))
		// 	.catch(err => console.log(err));
	}

});

app.service('ContactService', function($timeout) {
	var selectedForm = null;
	var doc = {};
	var flag = true;
	var user = null;
	var ref = null;
	var existingForm = false;
	var useExistingForm = function() {
		return existingForm;
	};
	var isNewForm = function() {
		user = firebase.auth().currentUser;
		ref = firestore.collection('contacts').doc(user.uid);
		return ref.get()
			.then((_doc) => {
				doc = _doc.data();
				if(doc.formCount > 0) {
					return false;
				} else {
					return true;
				}
			});
	}

	var selectForm = function(formOrdinal) {
		selectedForm = doc.formList[formOrdinal];
	}

	var setForm = function(e) {
		existingForm = e;
	}

	var update = function(data) {
		var docRef = null;
		
		if (isNewForm) {
			docRef = ref.collection('forms').doc();
			doc.formCount = doc.formCount + 1;
			doc.formList.push({
				id: docRef.id,
				title: data.title,
				timestamp: new Date()
			});
		} else {
			docRef = ref.collection('forms').doc(selectedForm);
		}
		ref.set({
			formCount : doc.formCount,
			formList: doc.formList
		}, {}).then(function() { console.log("set"); });
		return docRef.set(data, {merge: true})
			.then(function() {
				console.log("set out");
			});
	
	} 
	return {
		isNewForm: isNewForm,
		selectedForm: selectedForm,
		selectForm: selectForm,
		update: update,
		data: doc,
		setForm: setForm,
		useExistingForm: useExistingForm
	}
});