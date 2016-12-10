/* Service Worker - mukilane.github.io */
//https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/prefetch/service-worker.js
/*Functions - Caches, push messages  */

var CACHE_NAME = 'mukilane cache';

self.addEventListener('install', function(event) {
  var now = Date.now();
  //Cache Details
	var urlsToCache = [
	  '/scripts/pjax-standalone.min.js',
	  'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js',
	  'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js',
	  'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.min.js',
	  'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.min.css',
	  'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.min.js'
	];

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      var cachePromises = urlsToCache.map(function(urlToCache) {
        
        var url = new URL(urlToCache, location.href);
        url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

        var request = new Request(url, {mode: 'no-cors'});
        return fetch(request).then(function(response) {
          if (response.status >= 400) {
            throw new Error('request for ' + urlToCache +
              ' failed with status ' + response.statusText);
          }
          return cache.put(urlToCache, response);
        }).catch(function(error) {
          console.error('Not caching ' + urlToCache + ' due to ' + error);
        });
      });

      return Promise.all(cachePromises).then(function() {
        console.log('Pre-fetching complete.');
      });
    }).catch(function(error) {
      console.error('Pre-fetching failed:', error);
    })
  );
});



self.addEventListener('activate', function(event) {
	/* var CACHE = Object.keys(CACHE_NAME).map(function(key) {
    	return CACHE_NAME[key];
  	});
	// Active worker won't be treated as activated until promise resolves successfully.
  	event.waitUntil(
    	caches.keys().then(function(cacheNames) {
	      	return Promise.all(
	        	cacheNames.map(function(cacheName) {
	          		if (CACHE.indexOf(cacheName) == -1) {
	            		console.log('Deleting out of date cache:', cacheName);
	            		return caches.delete(cacheName);
	          		}
	        	})
	      	);
    	})
  	); */
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

/* self.addEventListener('push', function(event) {
	const title = 'Push Codelab';
  	const options = {
    	body: 'Yay it works.',
    	icon: 'images/icon.png',
    	badge: 'images/badge.png'
  	};		
  event.waitUntil(self.registration.showNotification(title, options));
}); */