var FixtureCtrl = function ($scope, CommonServices, MatchesService, GoalService) {
    $scope.openScorers = function (id) {
        $('#matchId_' + id).slideToggle();
    }

    $scope.goals = GoalService.goals;
    $scope.getweek = function () {
        var weeks = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.WeekId == $scope.week.Id) {
                weeks.push(key);
            }
        });
        $scope.selectedweek = weeks;
        CommonServices.state.loading = false;
    };

    $scope.seasonOptionChanged = function () {
        CommonServices.currentSeasonOption = $scope.seasons.indexOf($scope.season);//?
        MatchesService.previousSeasonId = CommonServices.currentSeasonOption;//?
        $scope.getSeasonData();
    }

    $scope.getSeasonData = function () {
        MatchesService.getSeasonMatches($scope.season.Id).then(function () {
            MatchesService.nextWeek = $scope.getWeekById(CommonServices.seasons[CommonServices.currentSeasonOption].NextWeek);
            $scope.week = $scope.weeks[0];
            $scope.getweek()
        });
        MatchesService.getSeasonWeeks($scope.season.Id);
        MatchesService.getSeasonTeams($scope.season.Id);
    }

    $scope.teams = MatchesService.teams;
    $scope.weeks = MatchesService.weeks;
    $scope.comingWeek = MatchesService.nextWeek;
    $scope.NextWeekNumber = MatchesService.NextWeekNumber;
    $scope.matches = MatchesService.seasonsMatches;
    $scope.seasons = CommonServices.seasons;
    $scope.season = $scope.seasons[CommonServices.currentSeasonOption];//?
    $scope.seasonId = MatchesService.seasonId;
    $scope.week = $scope.weeks[0];

    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
            if (MatchesService.seasonsMatches.length == 0) {
                $scope.season = CommonServices.seasons[CommonServices.currentSeasonOption];//?
                $scope.getSeasonData();
            }
            else {
                $scope.getweek();
            }

        }
    });
    $scope.$watchCollection('weeks', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.week = $scope.weeks[0];
        }
    });

    if (MatchesService.previousSeasonId != CommonServices.currentSeasonOption) {
        $scope.getSeasonData();
        MatchesService.previousSeasonId = CommonServices.currentSeasonOption;
    }
    $scope.getWeekById = function (id) {
        MatchesService.nextWeek = [];
        $scope.comingWeek = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.WeekId == id) {
                $scope.comingWeek.push(key);
            }
        });
        if ($scope.comingWeek.length) {
            MatchesService.NextWeekNumber = $scope.NextWeekNumber = $scope.comingWeek[0].Week.Number;

        }
        return $scope.comingWeek;
    };

    $scope.getNextWeek = function (weeks) {
        var found = false;
        var keepGoing = true;
        angular.forEach(weeks, function (key, value) {
            if (keepGoing) {
                if (found == true) {
                    keepGoing = false;
                    //$scope.week.Id = key.Id;
                    $scope.week = key;
                    $scope.getweek();
                }
                if (key.Id == $scope.week.Id) {
                    found = true;
                }
            }
        });
    };
    $scope.nextWeek = function () {
        $scope.getNextWeek($scope.weeks);
    };
    $scope.prevWeek = function () {
        var found = false;
        var keepGoing = true;
        var weeks = $scope.weeks;
        for (var i = weeks.length - 1; i >= 0; i--) {
            var key = weeks[i];
            if (keepGoing) {
                if (found == true) {
                    keepGoing = false;
                    //$scope.week.Id = key.Id;
                    $scope.week = key;
                    $scope.getweek();
                }
                if (key.Id == $scope.week.Id) {
                    found = true;
                }
            }
        }
    };
    $scope.getTeamMatches = function () {
        var weeks = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.HomeId == $scope.team.Id || key.AwayId == $scope.team.Id) {
                weeks.push(key);
            }
        });
        $scope.selectedweek = weeks;
    }
    $scope.getweek();
};