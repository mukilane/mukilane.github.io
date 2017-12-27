var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase!");
});

exports.sendNotification = functions.database.ref('/data/posts').onWrite( event => {
	let tokens = "cTaUcjx9H80:APA91bEBJsjhti2Wwnsc40B8Fe7gC08yjAAYeD…xpabLnSP2RfcoAQNmS6gt7lA7uCdxpYRUaPK728YfF5gGQbe9";
	// const token = admin.database().ref('/data/users/notificationToken/').once('value', (data) => tokens = data);
	
	const payload = {
		notification: {
			title: "Test",
			body: "New article available"
		}
	};
	admin.messaging().sendToDevice(tokens, payload).then(response => {
		console.log('Notification sent:', response);
	}).catch(error => {
		console.log(error);
	})

});