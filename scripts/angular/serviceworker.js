// Service Worker Registration
// Adapted from https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
if ('serviceWorker' in navigator) { // If Service worker feature is available in the browser
	navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
	/*registration.showNotification('Vibration Sample', { // Notification with Vibration
	body: 'Buzz! Buzz!',
	vibrate: [200, 100, 200, 100, 200, 100, 200],
	tag: 'vibration-sample'
	});*/
		// Get a handle for the toast service 
		var toaster = angular.element(document.getElementById('ctrl')).injector().get('Toast');
		registration.onupdatefound = function() { //When SW is changed
			// The updatefound event implies that reg.installing is set; see
			// https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event

			// Get the state of the service worker
			var installingWorker = registration.installing;
			// Track the service worker of any changes
			installingWorker.onstatechange = function() {
				switch (installingWorker.state) {
					case 'installed':
						if (navigator.serviceWorker.controller) {
							// Any old content will be purged and new content will be added to the cache
							toaster('New content available', 'refresh');
							// Refresh is done to load overcome the network first strategy.
							// Content will be loaded from the cache only the second time
							// The content won't be offline ready at the first visit.
						} else {
							// If controller is null, then it is the first visit, so first time caching is complete
							toaster('Content cached for offline use', 'ok');
						}
						break;
					case 'redundant':
						console.error('[SW] The installing service worker became redundant.');
						break;
				}
			};
		};
	}).catch(function(e) {
		console.error('[SW] Error during service worker registration:', e);
	});
}