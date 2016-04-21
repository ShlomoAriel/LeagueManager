'use strict';
app.controller('ManageUsersController', ['$scope', '$location', '$timeout', '$state', 'authService', function ($scope, $location, $timeout, $state, authService) {
   
    $scope.users = {};
    $scope.getUsers = function () {
        authService.getUsers().then(function (response) {
             $scope.users = response.data;
        });
    }
    $scope.getUsers();
    $scope.delete = function () {
        var userName = this.user.Id;
        var id = this.user.Id;
        authService.deleteUser(userName).then(function (response) {
            if (response.data == true)
                $("#user_" + id).fadeOut(500);
        });
    }
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $state.go('main.login');
        }, 2000);
    }
    $scope.addRole = function () {
        authService.addRole($scope.role).then(function (response) {
            alert("Role Aded");
        });
    }
 
}]);