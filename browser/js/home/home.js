app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($state,$scope){
	
	$scope.goToSurvey = function(activity){
		console.log("here");
		var choice = activity.target.firstChild.data;
		$state.go('survey',{choice: choice});
	}

});
