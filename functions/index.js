var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {
	let token;
	admin.firestore().collection("users").doc("data").get()
		.then( data => {
			token = data.data()['notificationTokens'];
			response.send(token);
		})
	
});

exports.sendNotification = functions.database.ref('/data/posts').onWrite( event => {
	// let tokens = "cTaUcjx9H80:APA91bEBJsjhti2Wwnsc40B8Fe7gC08yjAAYeD…xpabLnSP2RfcoAQNmS6gt7lA7uCdxpYRUaPK728YfF5gGQbe9";
	// admin.firestore().collection("users").doc("data").get()
	// 	.then(data => {
	// 		console.log(data.data());
	// 	});
	// const payload = {
	// 	notification: {
	// 		title: "Test",
	// 		body: "New article available"
	// 	}
	// };
	// admin.messaging().sendToDevice(this.tokens, payload).then(response => {
	// 	console.log('Notification sent:', response);
	// }).catch(error => {
	// 	console.log(error);
	// });
	admin.firestore().collection("users").doc("data").get()
		.then(data => {
			const tokens = data.data()['notificationTokens'];
			const payload = {
				notification: {
					title: "Test",
					body: "Notification works"
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