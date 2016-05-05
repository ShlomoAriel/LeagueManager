var EditCtrl = function ($rootScope, $scope, authService, $state) {
    authService.isAdmin().then(function (response) {
        if (response.data != '') {
            $state.go('main.login');
        }
    }).catch(function (response) {
        $state.go('main.login');
    });
}