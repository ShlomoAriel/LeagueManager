var EditWeekCtrl = function ($scope, TeamService, Weeks, Matches, MatchesService, CommonServices, $http) {
    if (CommonServices.seasons.length == 0) {
        CommonServices.getSeasons().then(function () {
            $scope.season = CommonServices.seasons[CommonServices.currentSeasonOption];//?
        });
    }
    $scope.seasons = CommonServices.seasons;
    $scope.seasonId = MatchesService.seasonId;
    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[0];
        }
    });

    $scope.matches = MatchesService.seasonsMatches;
    $scope.teams = TeamService.teams;
    $scope.weeks = MatchesService.weeks;
    $scope.hourStep = 1;
    $scope.minuteStep = 15;
    $scope.showMeridian = false;
    $scope.getweek = function () {
        var weeks = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.WeekId == $scope.week.Id) {
                weeks.push(key);
            }
        });
        $scope.selectedweek = weeks;
    };

    $scope.getSeasonWeeks = function () {
        MatchesService.getSeasonMatches($scope.season.Id);
        MatchesService.getSeasonWeeks($scope.season.Id);
        MatchesService.getSeasonTeams($scope.season.Id);
    };
    $scope.$watchCollection('weeks', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.week = $scope.weeks[0];
            $scope.getweek();
        }
    });
    $scope.$watchCollection('matches', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[0];
        }
    });
    $scope.editWeekTeams = function () {
        //TODO
        var matches = $scope.selectedweek;
        angular.forEach(matches, function (match) {
            var d2 = new Date(match.Date);
            match.Date = d2;
            match.Time = d2.getHours() + ':' + d2.getMinutes();
        });
        matches[0].WeekId = $scope.week.Id;
        matches[0].SeasonId = $scope.season.Id;
        $http.post('http://domain.redlionleague.com//api/Match/EditWeekTeams', matches)
            .success(function () {
                $scope.savedAlert();
            });

    }
    $scope.addMatch = function () {
        $http.get('http://domain.redlionleague.com//api/Match/GetEmptyMatch').success(function (data) {
            $scope.selectedweek.push(data);
        });

    };
    $scope.save = function () {
        var week = {};
        week.Number = $scope.week.Number;
        week.SeasonId = $scope.season.Id;

        Weeks.save(week, function () {
            $scope.getSeasonWeeks();
        });
    };
    $scope.deleteWeek = function () {
        var id = this.item.Id;
        Weeks.delete({ id: id }, function () {
            $("#item_" + id).fadeOut(500);
        });
    };
    $scope.deleteMatch = function () {
        var id = this.fixture.Id;
        Matches.delete({ id: id }, function () {
            $("#fixture_" + id).fadeOut(500);
            MatchesService.getSeasonMatches($scope.season.Id);

        });
    };
    $scope.savedAlert = function (e) {
        $('#saved').fadeOut('slow');
        $('#saved').fadeIn('slow', function () {
        });
    };
    $scope.nextWeek = function () {
        season = {};
        season.Id = $scope.season.Id;
        season.NextWeek = $scope.week.Id;
        $http.post('http://domain.redlionleague.com//api/Match/NextWeek', season).success(function (data) {
            alert('Added!');
        }).error(function () {
            alert('Error');
        });
    };
};