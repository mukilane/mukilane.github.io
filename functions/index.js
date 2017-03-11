var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase!");
})

exports.sendNotification = functions.database.ref('/data/posts').onWrite( event => {
	const tokens = admin.database().ref('/data/users/notificationToken');
	const payload = {
		notification: {
			title: event,
			body: "New article available"
		}
	};
	admin.messaging().sendToDevice(tokens, payload),then(response => {
		console.log('Notification sent:', response);
	}).catch(error => {
		console.log(error);
	})

});