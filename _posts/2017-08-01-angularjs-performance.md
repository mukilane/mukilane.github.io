---
layout: post
title:  "Tuning AngularJS for Performance"
date:   2017-01-08 19:52:20 +0530
category: blog
color: red-700
description: A list of methods to tune the performance of an AngularJS app
image: /assets/blog/angular-js.jpg
---

* TOC
{:toc}

## Introduction
AngularJS is a powerful framework to build apps for the web. With so many features to use, a developer may use them at their wish, without it's effect on the performance. Some simple tweaks and precautions can help to build a better performing AngularJS app.

## Disabling Debug Info

AngularJS, by default comes with debugging support enabled. For instance, the classes `ng-scope` and `ng-isolated-scope` are added to all elements that it processes, and the `ng-binding` class to the DOM elements tied to the scope. This may be useful for debugging in testing stages, using tools like Protactor or Bangarang. But on the production side, they may be additional overhead. It may delay the startup time. 

Though, disabling it is a very simple, with just one line of code.

{% highlight js %}
yourappmodule.config(function($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
});
{% endhighlight %}

But there is catch! Once disabled, you cannot access the scope of an element using `angular.element.scope()` method, which is actually not a good practice. 

## Disabling Directives checking

By default, Angular checks for all the elements, attributes, classes and comments to match with the directives. For a large app, it may be affect performance, especially at the startup. 

Checking for elements and attributes, is acceptable, since most of the directives that developers create are either of those. But class and comment attributes are not widely used. So, it's a waste of time and resource to check for them. 

Fortunately, Angular provides a way to disable checking for them.

{% highlight js %}
yourappmodule.config(function($compileProvider) {
	$compileProvider.cssClassDirectivesEnabled(false);
	$compileProvider.commentDirectivesEnabled(false);
});
{% endhighlight %}

## Defer digest cycle for simultaneous requests

{% highlight js %}
yourappmodule.config(function($httpProvider) {
	$httpProvider.useApplyAsync(true);
});
{% endhighlight %}

## Unregistering watchers

Watchers are AngularJS' way of listening to events.

{% highlight js %}
var somewatcher = $scope.$watch('varToWatch', () => {
	//Things to do
	somewatcher(); // Call the watcher to destroy it
});
{% endhighlight %}

## One time binding

One time binding is a feature available from AngularJS 1.3.

## Conclusion

Conclusion.