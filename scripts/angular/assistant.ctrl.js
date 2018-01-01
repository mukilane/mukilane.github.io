angular.module('port')
.controller('Assistant', function($scope, Conversation, $timeout) {
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
		switch(result.metadata.intentName) {
			case "portfolio":
				Conversation("Transporting you to my portfolio");
				$timeout(pjax.invoke('/portfolio/', 'main'), 2000, 1);
				break;
			case "resume":
				Conversation("Opening my resume");
				$timeout(window.open("https://goo.gl/zajpYF", "_blank"), 2000, 1);
				break;
			default:
				Conversation(result.fulfillment.speech);
		}
	}
});