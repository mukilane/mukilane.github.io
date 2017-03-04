## mukilane.github.io [![Build Status](https://travis-ci.org/mukilane/mukilane.github.io.svg?branch=master)](https://travis-ci.org/mukilane/mukilane.github.io)
My personal portfolio page 

## How it started
This site was started as a hobby project in 2015 with the [first commit][firstcommit] being from the Github Page Generator. Initially developed with basic [Material Design Lite](https://getmdl.io) framework, I switched to AngularJS in November 2016 and started a complete [revamp][revamp], with idea of making it a blog for all my works and thoughts.

### Frameworks and libraries used

1. [AngularJS](https://angularjs.org) (Frontend framework)
2. [Angular Material](https://material.angularjs.org)(UI library)
3. [PJAX](https://github.com/thybag/PJAX-Standalone)(Push-state AJAX Navigation)
4. [Jekyll](https://github.com/jekyll/jekyll) (Static Site Generator)
5. [Firebase](https://firebase.google.com) (Backend)

The frameworks that I've used are completely opensource except Firebase.

### Technologies used
1. Service Workers
2. Push Notifications
3. Microdata
4. Web Share API 

Service Worker was used to implement caching and Offline capabilities, and also to provide support for Push Notifications. Microdata is used for semantic markup. Web Share API is an experimental feature in Chrome, enabled using Origin Trial, to implement native sharing feature in mobile. 
**Note:** To enable this on Chrome Android, go to `chrome://flags/#enable-experimental-web-platform-features` and enable it. 

### Future plans
1. HTML5 Canvas
2. AMP support

Future plan path includes making the site AMP enabled and using Canvas for animations and interactions.

[firstcommit]: [https://github.com/mukilane/mukilane.github.io/commit/d18dff0fceeeded498a224bddf7d8cb49d99717d]
[revamp]: [https://github.com/mukilane/mukilane.github.io/commit/9d46aeac414a262e1ac12ce04f962f61ffcfac7e]
