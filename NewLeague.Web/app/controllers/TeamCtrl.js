var TeamCtrl = function ($scope, Teams, TeamService, $http) {
    $scope.teams = TeamService.teams;


    $scope.deleteTeam = function () {
        var id = this.item.Id;
        Teams.delete({ id: id }, function () {
            $("#item_" + id).fadeOut(500);
        });
    };
    $scope.editTeam = function () {
        var team = {};
        team.Id = $scope.team.Id;
        team.Name = $scope.team.Name;
        Teams.update(team, function () {
            alert('עודכן');
        });
    }

    $scope.save = function () {
        var team = {};
        team.Name = $scope.team.Name;

        Teams.save(team, function () {
            $scope.teams = Teams.query();
        });
    };
    $scope.addTeamCode = function () {
        $http.post('http://domain.redlionleague.com//api/Match/AddTeamCode', $scope.teamCode).success(function (data) {
            alert('Team Code Added');
        }).error(function () {
            alert('Error');
        });
    }

};
angular.module('routedTabs').controller('TeamCtrl', TeamCtrl);