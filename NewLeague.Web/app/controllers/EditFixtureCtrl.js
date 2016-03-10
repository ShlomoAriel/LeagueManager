var EditFixtureCtrl = function ($scope, PlayerService, Goals, MatchesService, GoalService, CommonServices, $http, $filter) {
    //if (CommonServices.seasons.length == 0) {
    //    CommonServices.getSeasons().then(function () {
    //        $scope.season = CommonServices.seasons[CommonServices.currentSeasonOption];//?
    //    });
    //}
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
    //$scope.$watchCollection('seasonPlayers', function (newValue, oldValue) {
    //    if (newValue.length) {
    //        PlayerService.getSeasonPlayers(CommonServices.currentSeasonId);
    //    }
    //});
    //if ($scope.players == "undefined" || $scope.players == null || $scope.players.length == 0) {
    //    PlayerService.getSeasonPlayers(CommonServices.currentSeasonId);
    //}
    $scope.goals = GoalService.goals;

    $scope.getweek = function () {
        //   $('#fixture-wrapper').fadeOut();
        var weeks = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.WeekId == $scope.week.Id) {
                weeks.push(key);
            }
        });
        $scope.selectedweek = weeks;
        // $('#fixture-wrapper').fadeIn();
    };
    $scope.editWeek = function () {
        var matches = $scope.selectedweek;
        $http.post('http://localhost:55460//api/Match/EditAWeek', matches);
    };
    $scope.updateweek = function () {
        var matches = $scope.selectedweek;
        //angular.forEach(matches, function (match) {
        //    angular.forEach($scope.goals, function (goal) {
        //        if(match.Id==goal.MatchId)
        //        {
        //            match.Goals.push(goal);
        //        }
        //    });
        //});
        $http.post('http://localhost:55460//api/Match/UpdateWeek', matches);
    }
    $scope.fixture = {};
    $scope.addHomeScorer = function () {
        var match = this.fixture;
        var goal = {};
        goal.MatchId = match.Id;
        goal.PlayerId = this.homeScorer.Id;
        goal.SeasonId = match.SeasonId;
        Goals.save(goal, function () {
            $scope.goals = GoalService.getGoals();
        });
    };
    $scope.addAwayScorer = function () {
        var match = this.fixture;
        var goal = {};
        goal.MatchId = match.Id;
        goal.PlayerId = this.awayScorer.Id;
        goal.SeasonId = match.SeasonId;
        Goals.save(goal, function () {
            $scope.goals = GoalService.getGoals();
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
};