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