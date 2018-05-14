// Directives Declaration
app.directive('calendar', function($mdSticky, $compile) {
    return {
      restrict: 'E',
      templateUrl: '/assets/calendar.html',
      link: function(scope,element) {
        $mdSticky(scope, element);
      }
    };
});

app.directive('tile', () => {
	return {
		restrict: 'E',
		transclude: true,
		template: "<div class='tile-wrap' style='background-image: url({{::image}}); opacity: {{::opacity}}; background-position: {{::pos}}; background-size: {{::size}}' ng-transclude></div>",
		scope: {
			image: '@',
			opacity: '@',
			pos: '@',
			size: '@'
		}
	}
});

app.directive('imageTile', () => {
	return {
		restrict: 'E',
		transclude: true,
		template: "<div class='tile-wrap' style='background-image: url({{::image}}); opacity: {{::opacity}}; background-position: {{::pos}}; background-size: {{::size}}'><div class='image-tile' ng-transclude></div></div>",
		scope: {
			image: '@',
			opacity: '@',
			pos: '@',
			size: '@'
		}
	}
});

app.directive('tileImage', () => {
	return {
		restrict: 'E',
		template: "<img ng-src='{{::source}}' style='opacity:{{::opacity}}; width: {{::width}};'/>",
		scope: {
			source: '@',
			opacity: '@',
			width: '@',
		}
	}
});

app.directive('tileHeader', () => {
	return {
		restrict: 'E',
		transclude: true,
		template: "<span class='tile-title' ng-transclude></span><br/><span style='opacity: 0.67; margin-top: 4px;'>{{::tag}}</span>",
		scope: {
			name: '@',
			tag: '@'
		}
	}
});

app.directive('tileFooter', () => {
	return {
		restrict: 'E',
		transclude: true,
		template: 	"<div layout='row' layout-align='space-between center'><span class='md-subhead' ng-transclude></span><span><i class='material-icons'>chevron_right</i></div>",
		scope: {
			external: '@'
		}
	}
});

app.directive('articleImage', () => {
	return {
		restrict: 'E',
		template: 	"<div style='background: #F3F3F3; text-align: center; float: {{::pos}}; margin: {{::margin}}; background: {{::bg}}'><img ng-src='{{::source}}' alt='{{::alt}}' width={{::width}} height={{::height}}/><div class='md-caption'> {{::alt}}</div></div>",
		scope: {
			source: '@',
			width: '@',
			pos: '@',
			alt: '@',
			bg: '@'
		},
	
		link: function(scope) {
			if(scope.pos == "left") {
				scope.margin = "0 24px 24px 0";
			} else if(scope.pos == "right") {
				scope.margin = "0 0 24px 24px";
			} else {
				scope.margin = "24px 0 24px 0";
			}
		},
	}
});

//PJAX events listener
app.directive('pjaxNav', ['$compile', function($compile){ 
	return {
		restrict: 'A', 
		link: function(scope, elem) {			
			elem.bind('beforeSend', function(e) {
				scope.trust(e.data.url);
				var toAnim = angular.element(document.getElementById('content'));
				toAnim.removeClass('fade-up');
				toAnim.addClass('fade-down');
				var title = angular.element(document.getElementsByClassName('banner'));
				title.removeClass('fade-right');
				title.addClass('fade-left');
			});
			elem.bind('success', function(e) {
				// Recompiling the DOM on page loads through PJAX
				$compile(elem.contents())(scope);
				var toAnim = angular.element(document.getElementById('content'));
				toAnim.removeClass('fade-down');
				toAnim.addClass('fade-up');
				var title = angular.element(document.getElementsByClassName('banner'));
				title.removeClass('fade-left');
				title.addClass('fade-right');
			});
			elem.bind('error', function() {
				pjax.invoke('/404/', 'main');
				$compile(elem.contents())(scope);
			});
		}
	};
}]);

// Shortcut event listener
app.directive('shortcut', ['$document', function($document) {
	return {
		restrict: 'A',
		controller: 'main',
		link: function(scope, elem, attr, ctrl) {
			$document.bind('keypress', function(event) {
				if (event.which == 47) {
					if(event.target.nodeName != 'INPUT') {
						scope.$apply(attr.shortcut);
						event.preventDefault();
					}
				}
			});
		} 
	}
}]);