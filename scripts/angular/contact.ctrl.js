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
	$scope.contact = {};
	$scope.forms = [];
	$scope.selectedForm = {}; // Todo
	ContactService.getForms().then((data) => $scope.forms = data );
	$scope.selectForm = () => {
		console.log($scope.contact.id);
		ContactService.selectForm($scope.contact.id);
	}
	$scope.submit = (close) => {
		ContactService.update($scope.contact)
			.then(function() {
				console.log("set out");
				Toast("Done. Reply soon!")
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
	return {
		isNewForm: isNewForm,
		selectedForm: selectedForm,
		selectForm: selectForm,
		update: update,
		setForm: setForm,
		useExistingForm: useExistingForm,
		getForms: getForms
	}
});