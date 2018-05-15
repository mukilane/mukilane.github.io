var config={apiKey:"AIzaSyD8Jyc_TJwBwAwmkN8ETzUXKPWLiXGsEn0",authDomain:"mukilane.github.io",databaseURL:"https://mukil-elango.firebaseio.com",projectId:"mukil-elango",storageBucket:"mukil-elango.appspot.com",messagingSenderId:"771554923359"};firebase.initializeApp(config);var app=angular.module("port",["ngMaterial","ngAnimate","firebase"]);
app.config(["$mdThemingProvider","$interpolateProvider","$httpProvider","$compileProvider","$locationProvider","$controllerProvider",function(a,d,b,c,e,f){app.controllerProvider=f;a.theme("default").accentPalette("blue");a.enableBrowserColor({theme:"default",palette:"background",hue:"50"});d.startSymbol("{*");d.endSymbol("*}");b.useApplyAsync(!0);c.debugInfoEnabled(!1);c.cssClassDirectivesEnabled(!1);c.commentDirectivesEnabled(!1);e.hashPrefix("")}]);
angular.module("port").controller("Assistant",["$scope","Conversation","$timeout",function(a,d,b){var c=new ApiAi.ApiAiClient({accessToken:"bd52bb26359c45ceb2da599fe21a94c9"});a.result="";a.query="";a.send=function(){""!==a.query&&c.textRequest(a.query).then(function(b){a.parse(b.result);a.query=""}).catch(function(a){return console.log(a)})};a.parse=function(c){switch(c.action){case "portfolio":d("Transporting you to my portfolio");b(pjax.invoke("/portfolio/","main"),2E3);break;case "resume":d("Opening my resume");
b(window.open("https://goo.gl/zajpYF","_blank"),2E3);break;case "navigate":d("Transporting!");b(a.transport(c.parameters.page),2E3);break;case "smalltalk.greetings.bye":d(c.fulfillment.speech);a.showAssist=!1;break;case "smalltalk.agent.acquaintance":d("I'm Mukil. Know more about me here");b(a.transport("about"),1E3);break;case "blog.newposts":d(c.fulfillment.speech);b(a.transport("blog"),1E3);break;default:d(c.fulfillment.speech)}};a.transport=function(a){if(-1!=="blog about portfolio contact certificates home".split(" ").indexOf(a)){var b=
"/"+a+"/";"home"===a&&(b="/");pjax.invoke(b,"main")}else d("Sorry, the page does not exist")}}]);
app.controller("feedback",["$scope","$firebaseObject","$firebaseAuth","Dialog",function(a,d,b,c){var e=b(),f=firebase.database().ref("feedback");a.close=function(){c.close()};a.showMsg=!1;a.signIn=function(){a.showMsg=!0;a.firebaseUser=null;e.$signInAnonymously().then(function(b){a.firebaseUser=b;a.data=d(f.push())}).catch(function(a){console.log("Error occured during sending")})};a.thumbs=function(b){a.data=d(f.push());a.data.$save().then(function(){})};a.sendMsg=function(){a.data.$save().then(function(){console.log("Feedback Sent");
c.close()}).catch(function(a){console.log("Error!")})}}]);
app.controller("main",["$scope","$interval","$window","Toast","$sce","Dialog",function(a,d,b,c,e,f){a.gridLay=!0;a.showAssist=!1;localStorage.getItem("theme")?(a.isDark=!0,a.theme={bg:"grey-800",footer:"grey-700"}):(a.isDark=!1,a.theme={bg:"grey-A100",footer:"grey-A100"});a.setDark=function(b){(a.isDark=b)?(localStorage.setItem("theme","dark"),c("Dark theme activated","refresh")):(localStorage.removeItem("theme"),c("Light theme activated","refresh"))};a.isHomePage=function(){return"/"===window.location.pathname?
!0:!1};a.navigate=function(b){pjax.invoke(b,"main");a.hideHomeButton=a.isHomePage()};a.hideHomeButton=a.isHomePage();a.counter=0;a.adjective="A Web Developer;A Programmer;Google Play Rising Star;Loves OpenSource;A Linux Admin;Elon Musk Fan;Philomath;Tech Enthusiast".split(";");d(function(){7>a.counter?a.counter++:a.counter=0},5E3);b.addEventListener("offline",function(){c("You're Offline. Serving from cache!",!1);b.addEventListener("online",function(a){c("You're Online now !","ok")},{once:!0,capture:!1})},
!1);a.trust=function(a){e.trustAsUrl(a)};a.show=function(b){1==a.gridLay&&(a.gridLay=!1,navigator.onLine||c("You're offline. Serving from cache!"))};a.showDlg=function(a){f.show("feedback",a)};a.go=function(a){b.location.href=e.trustAsResourceUrl(a)}}]);
app.controller("notifications",["$scope","$firebaseObject","Toast",function(a,d,b){a.isNotificationEnabled=!1;localStorage.getItem("isNotificationEnabled")&&(a.isNotificationEnabled=!0);a.setEnabled=function(){localStorage.setItem("isNotificationEnabled","true");a.isNotificationEnabled=!0};var c=firebase.messaging();a.enableNotifications=function(){c.requestPermission().then(function(){b("Notifications are enabled");a.setEnabled();a.getToken()}).catch(function(a){console.log(a);b("Notifications blocked!. To enable, go to site settings.")})};
a.getToken=function(){c.getToken().then(function(a){if(a){var b=[];firebase.firestore().collection("users").doc("data").get().then(function(c){b=c.data().notificationTokens;b.push(a);firebase.firestore().collection("users").doc("data").update({notificationTokens:b})})}})};c.onMessage(function(a){return b(a)})}]);app.controller("search",["$scope","$firebaseObject",function(a,d){a.posts=[];firebase.database().ref("data/posts").once("value").then(function(b){b=b.val();angular.forEach(b,function(b){a.posts.push(b)})})}]);
app.controller("share",["$scope","Dialog","Toast","$mdMedia","$mdBottomSheet",function(a,d,b,c,e){a.link=window.location.href;a.title=angular.element(window.document)[0].title;a.Toast=b;a.openShare=function(a){1==c("xs")?e.show({templateUrl:"/assets/sharebtm-template.html",clickOutsideToClose:!0,controller:"share"}):d.show("share",a)};a.closeShare=function(){d.close()}}]);
app.controller("ProjectCtrl",["Panel",function(a,d){this.show=function(a){d(a)};$http.get("assets/projects.json").then(function(b){a.projects=b.data;console.log(a.projects)})}]);app.controller("HdocCtrl",["$scope","$http","$anchorScroll","$location",function(a,d,b,c){a.scrollTo=function(a){a="day"+a;c.hash()!==a?c.hash(a):b()}}]);app.directive("calendar",["$mdSticky","$compile",function(a,d){return{restrict:"E",templateUrl:"/assets/calendar.html",link:function(b,c){a(b,c)}}}]);
app.directive("tile",function(){return{restrict:"E",transclude:!0,template:"\x3cdiv class\x3d'tile-wrap' style\x3d'background-image: url({{::image}}); opacity: {{::opacity}}; background-position: {{::pos}}; background-size: {{::size}}' ng-transclude\x3e\x3c/div\x3e",scope:{image:"@",opacity:"@",pos:"@",size:"@"}}});
app.directive("imageTile",function(){return{restrict:"E",transclude:!0,template:"\x3cdiv class\x3d'tile-wrap' style\x3d'background-image: url({{::image}}); opacity: {{::opacity}}; background-position: {{::pos}}; background-size: {{::size}}'\x3e\x3cdiv class\x3d'image-tile' ng-transclude\x3e\x3c/div\x3e\x3c/div\x3e",scope:{image:"@",opacity:"@",pos:"@",size:"@"}}});
app.directive("tileImage",function(){return{restrict:"E",template:"\x3cimg ng-src\x3d'{{::source}}' style\x3d'opacity:{{::opacity}}; width: {{::width}};'/\x3e",scope:{source:"@",opacity:"@",width:"@"}}});app.directive("tileHeader",function(){return{restrict:"E",transclude:!0,template:"\x3cspan class\x3d'tile-title' ng-transclude\x3e\x3c/span\x3e\x3cbr/\x3e\x3cspan style\x3d'opacity: 0.67; margin-top: 4px;'\x3e{{::tag}}\x3c/span\x3e",scope:{name:"@",tag:"@"}}});
app.directive("tileFooter",function(){return{restrict:"E",transclude:!0,template:"\x3cdiv layout\x3d'row' layout-align\x3d'space-between center'\x3e\x3cspan class\x3d'md-subhead' ng-transclude\x3e\x3c/span\x3e\x3cspan\x3e\x3ci class\x3d'material-icons'\x3echevron_right\x3c/i\x3e\x3c/div\x3e",scope:{external:"@"}}});
app.directive("articleImage",function(){return{restrict:"E",template:"\x3cdiv style\x3d'background: #F3F3F3; text-align: center; float: {{::pos}}; margin: {{::margin}}; background: {{::bg}}'\x3e\x3cimg ng-src\x3d'{{::source}}' alt\x3d'{{::alt}}' width\x3d{{::width}} height\x3d{{::height}}/\x3e\x3cdiv class\x3d'md-caption'\x3e {{::alt}}\x3c/div\x3e\x3c/div\x3e",scope:{source:"@",width:"@",pos:"@",alt:"@",bg:"@"},link:function(a){a.margin="left"==a.pos?"0 24px 24px 0":"right"==a.pos?"0 0 24px 24px":
"24px 0 24px 0"}}});
app.directive("pjaxNav",["$compile",function(a){return{restrict:"A",link:function(d,b){b.bind("beforeSend",function(a){d.trust(a.data.url);a=angular.element(document.getElementById("content"));a.removeClass("fade-up");a.addClass("fade-down");a=angular.element(document.getElementsByClassName("banner"));a.removeClass("fade-right");a.addClass("fade-left")});b.bind("success",function(c){a(b.contents())(d);c=angular.element(document.getElementById("content"));c.removeClass("fade-down");c.addClass("fade-up");
c=angular.element(document.getElementsByClassName("banner"));c.removeClass("fade-left");c.addClass("fade-right")});b.bind("error",function(){pjax.invoke("/404/","main");a(b.contents())(d)})}}}]);app.directive("shortcut",["$document",function(a){return{restrict:"A",controller:"main",link:function(d,b,c,e){a.bind("keypress",function(a){47==a.which&&"INPUT"!=a.target.nodeName&&(d.$apply(c.shortcut),a.preventDefault())})}}}]);
app.factory("Conversation",["$mdToast","$window",function(a,d){return function(b){b=a.simple().textContent(b).capsule(!0).parent(document.querySelectorAll(".assist-bar")).hideDelay(4E3).toastClass("assist-toast").position("top right");a.show(b)}}]);
app.factory("Toast",["$mdToast","$window",function(a,d){return function(b,c){""!==c?(b=a.simple().textContent(b).action(c).highlightAction(!0),a.show(b).then(function(b){if("ok"==b)switch(c){case "refresh":d.location.reload();break;case "ok":a.hide()}},function(a){angular.noop()})):a.showSimple(b)}}]);
app.factory("Dialog",["$mdDialog","Toast",function(a,d){return{show:function(b,c){a.show({templateUrl:"/assets/"+b+"-template.html",parent:angular.element(document.body),targetEvent:c,controller:b,clickOutsideToClose:!0})},close:function(){a.cancel()}}}]);
app.factory("Panel",["$mdPanel",function(a){function d(a){this.close=function(){a&&a.close().then(function(){a.destroy()})}}d.$inject=["mdPanelRef"];return function(b){this._mdPanel=a;b="/project/"+b+".html";var c=this._mdPanel.newPanelPosition().absolute().center();b={animation:this._mdPanel.newPanelAnimation().withAnimation(this._mdPanel.animation.FADE),attachTo:angular.element(document.body),controller:d,controllerAs:"ctrl",disableParentScroll:this.disableParentScroll,templateUrl:b,hasBackdrop:!0,
panelClass:"modal-container",position:c,trapFocus:!0,zIndex:150,clickOutsideToClose:!0,escapeToClose:!0,focusOnOpen:!0};this._mdPanel.open(b)}}]);
"serviceWorker"in navigator&&navigator.serviceWorker.register("/service-worker.js").then(function(a){var d=angular.element(document.getElementById("ctrl")).injector().get("Toast");a.onupdatefound=function(){var b=a.installing;b.onstatechange=function(){switch(b.state){case "installed":navigator.serviceWorker.controller?d("New content available","refresh"):d("Content cached for offline use","ok");break;case "redundant":console.error("[SW] The installing service worker became redundant.")}}}}).catch(function(a){console.error("[SW] Error during service worker registration:",
a)});