'use strict';
app.controller('SignupController', ['$scope', '$location', '$timeout', '$state', 'authService', 'TeamService', function ($scope, $location, $timeout, $state, authService, TeamService) {
    $scope.teams = TeamService.teams;
    $scope.$watchCollection('teams', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.player.TeamId = $scope.teams[0].Id;
        }
    });
    if ($scope.teams == "undefined" || $scope.teams == null || $scope.teams.length == 0) {
        TeamService.getTeams();
    }

    $scope.savedSuccessfully = false;
    $scope.message = "";
 
    $scope.registration = {
        userName: "",
        password: "",
        confirmPassword: "",
        TeamId:0
    };
 
    $scope.signUp = function () {
 
        authService.saveRegistration($scope.registration).then(function (response) {
 
            $scope.savedSuccessfully = true;
            $scope.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
            startTimer();
 
        },
         function (response) {
             var errors = [];
             for (var key in response.data.modelState) {
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }
             $scope.message = "Failed to register user due to:" + errors.join(' ');
         });
    };
 
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            //$location.path('/login');
            $state.go('main.login');
        }, 2000);
    }
 
}]);