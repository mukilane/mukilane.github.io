/* Service Worker - mukilane.github.io */

self.addEventListener('install', function(event) {

	//Cache Details
	var CACHE_NAME = 'mukilane cache';
	var urlsToCache = [
	  '/',
	  '/css/style.css',
	  '/scripts/main.js',
	  'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.js',
	  'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.js',
	  'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.js',
	  'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.min.css',
	  'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.min.js'
	];

	//Post-installation steps
	  event.waitUntil(
	  	//Setting up Cache
	    caches.open(CACHE_NAME)
	      .then(function(cache) {
	        console.log('Cache opened');
	        return cache.addAll(urlsToCache);
	      })
	  );
});


self.addEventListener('activated', function(event) {
	console.log('SW activated');
});

//Network Proxy -- Cache response
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request) //Check whether resource is available in Cache
      .then(function(response) {
        if (response) {  //Then respond from cache
          return response;
        }

        return fetch(event.request);
        
        /*var request = event.request.clone();

        return fetch(request).then(function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
        }); */
      }
    )
  );
});