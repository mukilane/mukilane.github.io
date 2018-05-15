// Factory for Assistant conversation
app.factory('Conversation', ['$mdToast', '$window', function($mdToast, $window) {
	return function(msg) {
		var toast = $mdToast.simple()
			.textContent(msg)
			.capsule(true)
			.parent(document.querySelectorAll(".assist-bar"))
			.hideDelay(4000)
			.toastClass("assist-toast")
			.position("top right");
		$mdToast.show(toast);
	};
  }]);

// Factory for displaying toasts
app.factory('Toast', ['$mdToast', '$window', function($mdToast, $window) {
  return function(msg, action) {
   	if (action !== '') { // Whether the toast should show an action button
   		var toast = $mdToast.simple()
	      .textContent(msg)
	      .action(action)
	      .highlightAction(true);
			$mdToast.show(toast).then(function(response) {
				if ( response == 'ok' ) {
					switch (action) {
						case 'refresh':
							$window.location.reload();
							break;
						case 'ok':
							$mdToast.hide();
							break;
					}
				}
			}, function(err) {
				angular.noop();
			});
		} else {
			$mdToast.showSimple(msg);
			// or $mdToast.show($mdToast.simple().textContent(msg));
		}
  };
}]);
// Factory for displaying Dialogs
app.factory('Dialog', ['$mdDialog', 'Toast' , function($mdDialog, Toast) {
	return {
		show : function(dlg, ev) { 
				$mdDialog.show({
					templateUrl: '/assets/' + dlg + '-template.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					controller: dlg,
					clickOutsideToClose: true
				});
		},
		close : function() {
			$mdDialog.cancel();
		}
	};
}]);
// Factory for displaying Panels
app.factory('Panel', ['$mdPanel', function($mdPanel) {
	// Controller for Panel instance
	/*@ngInject*/ function PanelCtrl(mdPanelRef) { 
		this.close = function() {
			mdPanelRef && mdPanelRef.close().then(function() {
				mdPanelRef.destroy();
			})
		} 
	}
	return function(dest) {
		this._mdPanel = $mdPanel;
		var tmpl = '/project/' + dest + '.html';
		var position = this._mdPanel.newPanelPosition().absolute().center();
		var animation = this._mdPanel.newPanelAnimation().withAnimation(this._mdPanel.animation.SLIDE);
		animation.openFrom({
			top: document.documentElement.clientHeight,
			left: 0
		});
		animation.closeTo({
			top: document.documentElement.clientHeight,
			left: 0
		});
		animation.duration({
			open: 500,
			close: 300
		});
		var config = {
			animation: animation,
			attachTo: angular.element(document.body),
			controller: PanelCtrl,
			controllerAs: 'ctrl',
			disableParentScroll: this.disableParentScroll,
			templateUrl: tmpl,
			hasBackdrop: true,
			panelClass: 'modal-container',
			position: position,
			trapFocus: true,
			zIndex: 150,
			clickOutsideToClose: true,
			escapeToClose: true,
			focusOnOpen: true
		};
		this._mdPanel.open(config);
		}
}]);