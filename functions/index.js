var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {
	var notification = request.notification;

	admin.firestore().collection("users").doc("data").get()
		.then(data=> {
			const tokens = data.data()['notificationTokens'];
			const payload = {
				title: notification.title,
				body: notification.body,
				click_action: notification.click_action
			};
			admin.messaging().sendToDevice(tokens, payload)
				.then(res => {
					response.send("Notification sent:", res);
				}).catch(error => {
					respose.send(error);
				});
		});

	// admin.firestore().collection("users").doc("data").get()
	// 	.then( data => {
	// 		token = data.data()['notificationTokens'];
	// 		response.send(token);
	// 	})
});

exports.sendNotification = functions.database.ref('/data/posts').onWrite( event => {
	console.log(event.data.val());
	admin.firestore().collection("users").doc("data").get()
		.then(data => {
			const tokens = data.data()['notificationTokens'];
			const payload = {
				notification: {
					title: "A new post is waiting",
					body: event.data.val().title,
					click_action: "https://mukilane.github.io" + event.data.val().url
				}
			};
			admin.messaging().sendToDevice(tokens, payload)
				.then(response => {
					console.log("Notification sent:", response);
				}).catch(error => {
					console.log(error);
				})

		});
});