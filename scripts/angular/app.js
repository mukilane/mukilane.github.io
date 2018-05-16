// Main JS - mukilane.github.io
// Firebase initialization
var config = {
    apiKey: "AIzaSyD8Jyc_TJwBwAwmkN8ETzUXKPWLiXGsEn0",
    authDomain: "mukilane.github.io",
    databaseURL: "https://mukil-elango.firebaseio.com",
    projectId: "mukil-elango",
    storageBucket: "mukil-elango.appspot.com",
    messagingSenderId: "771554923359"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
// Angular App initialization
var app = angular.module('port', ['ngMaterial', 'ngAnimate', 'firebase']);
// Angular Confiurations
app.config(function($mdThemingProvider, $interpolateProvider, $httpProvider, $compileProvider, $locationProvider, $controllerProvider) {
	"ngInject";
	// Reference for Controller Provider for Dynamic(Lazy) dependency injection
	app.controllerProvider = $controllerProvider;
	// Overriding Default theme
	$mdThemingProvider.theme('default')
		.accentPalette('blue');

	// Browser Color   
	$mdThemingProvider.enableBrowserColor({
		theme: 'default', 
		palette: 'background', 
		hue: '50'
  	});

	// Overriding Interpolation symbols to avoid conflict with Liquid tags
	$interpolateProvider.startSymbol('{*');
	$interpolateProvider.endSymbol('*}');

	// Performance configurations	
	// Deferring digest cycles for multiple http requests
	// Handling simultaneous requests and '$apply' in the next digest cycle
	$httpProvider.useApplyAsync(true);

	// Disable debug info - removes 'ng-scope' and 'ng-isolate' classes
	$compileProvider.debugInfoEnabled(false);
	// Disable checking for css class directives
	$compileProvider.cssClassDirectivesEnabled(false);
	// Disable checking for comment directives
	$compileProvider.commentDirectivesEnabled(false);

	$locationProvider.hashPrefix('');
});