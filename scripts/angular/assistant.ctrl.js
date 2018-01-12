angular.module('port')
.controller('Assistant', function($scope, Conversation, $timeout) {
	"ngInject";
    var assistant = new ApiAi.ApiAiClient({accessToken: "bd52bb26359c45ceb2da599fe21a94c9" });
	$scope.result = "";
	$scope.query = "";
	$scope.send = ()=> {
		if($scope.query !== "") {
			assistant.textRequest($scope.query)
			.then((response) => {
				$scope.parse(response.result);
				$scope.query = "";
			}).catch((error) => console.log(error));
		}
	};

	$scope.parse = (result) => {
		switch(result.action) {
			case "portfolio":
				Conversation("Transporting you to my portfolio");
				$timeout(pjax.invoke('/portfolio/', 'main'), 2000);
				break;
			case "resume":
				Conversation("Opening my resume");
				$timeout(window.open("https://goo.gl/zajpYF", "_blank"), 2000);
				break;
			case "navigate":
				Conversation("Transporting!")
				$timeout($scope.transport(result.parameters.page), 2000);
				break;
			case "smalltalk.greetings.bye":
				Conversation(result.fulfillment.speech);
				$scope.showAssist = false;
			case "smalltalk.agent.acquaintance":
				Conversation("I'm Mukil. Know more about me here");
				$timeout($scope.transport('about'), 1000);
			case "blog.newposts":
				Conversation(result.fulfillment.speech);
				$timeout($scope.transport('blog'), 1000);
			default:
				Conversation(result.fulfillment.speech);
		}
	}

	$scope.transport = (page) => {
		var list = ['blog', 'about', 'portfolio', 'contact', 'certificates', 'home'];
		if(list.indexOf(page) !== -1) {
			let dest = '/' + page + '/' ;
			if (page === 'home') { dest = '/'; }
			pjax.invoke(dest, 'main');
		} else {
			Conversation('Sorry, the page does not exist');
		}
	}

});