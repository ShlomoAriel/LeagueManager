var EditScoreCtrl = function ($scope, PlayerService, Goals, MatchesService, GoalService, CommonServices, $http, $filter) {
    $scope.players = PlayerService.seasonPlayers;
    $scope.seasonId = MatchesService.seasonId;
    $scope.matches = MatchesService.seasonsMatches;
    $scope.weeks = MatchesService.weeks;
    $scope.seasons = CommonServices.seasons;
    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[0];
            $scope.getSeasonWeeks();
            PlayerService.getSeasonPlayers(CommonServices.currentSeasonId);
        }
    });
    $scope.$watchCollection('weeks', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.week = $scope.weeks[0];
            $scope.getweek();
        }
    });
    $scope.goals = GoalService.goals;

    $scope.getweek = function () {
        var weeks = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.WeekId == $scope.week.Id) {
                weeks.push(key);
            }
        });
        $scope.selectedweek = weeks;
    };
    //$scope.editWeek = function () {
    //    var matches = $scope.selectedweek;
    //    $http.post('http://domain.redlionleague.com//api/Match/EditAWeek', matches);
    //};
    $scope.updateweek = function () {
        var matches = $scope.selectedweek;
        $http.post('http://domain.redlionleague.com//api/Match/UpdateWeek', matches)
        .success(function () {
            $scope.savedAlert();
        });;
    }
    $scope.fixture = {};
    $scope.addHomeScorer = function () {
        var match = this.fixture;
        var goal = {};
        goal.MatchId = match.Id;
        goal.PlayerId = this.homeScorer.Id;
        goal.SeasonId = match.SeasonId;
        Goals.save(goal, function (data) {
            if(data!=null)
                $scope.goals.push(data);
        });
    };
    $scope.addAwayScorer = function () {
        var match = this.fixture;
        var goal = {};
        goal.MatchId = match.Id;
        goal.PlayerId = this.awayScorer.Id;
        goal.SeasonId = match.SeasonId;
        Goals.save(goal, function (data) {
            if (data != null)
                $scope.goals.push(data);
        });
    };
    $scope.savedAlert = function (e) {
        $('#saved').fadeIn('slow', function () {
            $('#saved').fadeOut('slow');
        });
    };
    $scope.getSeasonWeeks = function () {
        MatchesService.getSeasonMatches($scope.season.Id);
        MatchesService.getSeasonWeeks($scope.season.Id);
        MatchesService.getSeasonTeams($scope.season.Id);
    };
    $scope.deleteGoal = function () {
        var id = this.goal.Id;
        Goals.delete({ id: id }, function () {
            $("#goal_" + id).fadeOut(500);
        });
    };
    $scope.savedAlert = function (e) {
        $('#saved').fadeOut('slow');
        $('#saved').fadeIn('slow', function () {
        });
    };
};