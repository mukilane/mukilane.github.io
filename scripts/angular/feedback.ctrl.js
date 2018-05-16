// Controller for feeback form
app.controller('feedback', function ($scope, $firebaseObject, $firebaseAuth, Dialog) {
  "ngInject";
  var auth = $firebaseAuth();
  $scope.close = function() {
    Dialog.close();
  }
  $scope.showMsg = false;
  $scope.signIn = function() {
    $scope.showMsg = true;
      $scope.firebaseUser = null;
      // Anonymous Sign in
      auth.$signInAnonymously().then(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
      }).catch(function(error) {
        console.log("Error occured during sending");
      });
  };
  $scope.thumbs = function(e) {
    // $scope.data = $firebaseObject(ref.push());
    // $scope.data.$save().then(function() {
      
    // });
  }
  $scope.sendMsg = function() {
    firestore.collection("feedback").add({
      username: $scope.data.username,
      message: $scope.data.message,
      timestamp: new Date() 
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      Dialog.close();
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
  };
});