var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const nodemailer = require('nodemailer');
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmailEmail,
		pass: gmailPassword
	},
});

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

exports.sendMailForm = functions.firestore.document('contacts/{userId}/{forms}/{formId}').onWrite((change, context) => {
		var data = change.after.data();
		console.log(data);
		var toEmail = data.email;
		const mailOptions = {
		    from: 'Mukil Elango <mukilane@gmail.com>',
			to: toEmail
	 	};
	 	mailOptions.subject = "Hi, " + data.name + ". Your form is received!";
	 	mailOptions.text = "Your form is received. The data is " + JSON.stringify(data) ;
	 	mailOptions.html = "<b>Your form is received</b><br/>The data is:<br/><i>" + JSON.stringify(data) + "</i>"; 
	 	return mailTransport.sendMail(mailOptions)
	 		.then(() => {
	 			console.log("Mail sent");
	 		})
	 		.catch((err) => console.log(err));
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