var SeasonCtrl = function ($scope, $location, Seasons, CommonServices, TeamService, $rootScope, $state, $stateParams, $http) {
    if (CommonServices.seasons.length == 0) {
        CommonServices.getSeasons().then(function () {
            $scope.season = CommonServices.seasons[CommonServices.currentSeasonOption];//?
        });
    }
    $scope.seasons = CommonServices.seasons;
    $scope.teams = TeamService.teams;


    $scope.deleteSeason = function () {
        var id = this.item.Id;
        Seasons.delete({ id: id }, function () {
            $("#item_" + id).fadeOut(500);
        });
    };

    $scope.save = function () {
        var season = {};
        season.Name = $scope.season.Name;

        Seasons.save(season, function () {
            $scope.seasons = Seasons.query();
        });
    };
    $scope.savedAlert = function (e) {
        $('.added').fadeIn('slow', function () {
            $('.added').fadeOut('slow');
        });
    };
    $scope.deletedAlert = function (e) {
        $('.deleted').fadeIn('slow', function () {
            $('.deleted').fadeOut('slow');
        });
    };
    $scope.addTeamToSeason = function () {
        var SeasonTeam = {};
        SeasonTeam.SeasonId = $scope.season.Id;
        SeasonTeam.TeamId = $scope.team.Id;

        $http.post('http://domain.redlionleague.com//api/Match/AddTeamToSeason', SeasonTeam).success(function (data) {
            CommonServices.getSeasons();
            $scope.savedAlert();
        }).error(function () {
            alert('Error');
        });

    }; $scope.deleteTeamFromSeason = function () {
        var seasonTeam = {};
        seasonTeam.SeasonId = this.item.Id;
        seasonTeam.TeamId = this.team.Id;
        $http.post('http://domain.redlionleague.com//api/Match/DeleteTeamFromSeason', seasonTeam).success(function () {
            CommonServices.getSeasons();
            $scope.deletedAlert();
            $("#seasonteam_" + seasonTeam.TeamId).fadeOut(500);
        });

    }
};
angular.module("routedTabs").controller("SeasonCtrl", SeasonCtrl);