var EditCtrl = function ($scope, Players, Teams, Weeks, Goals, Matches, Seasons, $timeout, $compile, $element, $http, $filter) {
    $scope.players = Players.query();
    $scope.scorers = [];
    $scope.seasons = Seasons.query(function () {
        $scope.season = $scope.seasons[0];
        $scope.fixtureWeekAndScorers();
    });
    $scope.teams = [];//Teams.query();
    $scope.weeks = [];//Weeks.query();
    $scope.goals = Goals.query();
    $scope.hourStep = 1;
    $scope.minuteStep = 15;
    $scope.showMeridian = false;
    ////$scope.item.selected = undefined;
    //$scope.dateTimeNow = function () {
    //    var date = new Date();
    //    //date.setHours(0, 0);
    //    $scope.date = date;
    //};
    //$scope.dateTimeNow();


    $scope.add = function () {
        var el = $compile("<test text='now'></test>")($scope);
        var wrapper = $element.find('#week-wrapper');
        wrapper.append(el);
    };
    $scope.getweek = function () {
        $scope.selectedweek = {};
        $http.get('http://localhost:55460//api/Match/GetMatchesByWeek', {
            params: { week: $scope.week.Id, seasonId: $scope.season.Id }
        }).success(function (data) {
            //matches = $scope.groupByDate(data);
            //$scope.selectedweek = matches;
            $scope.selectedweek = data;
        });
    };
    $scope.fixtureWeekAndScorers = function () {
        $scope.getSeasonWeeks();
        $scope.getScorers();
    };
    $scope.getSeasonWeeks = function () {
        $http.get('http://localhost:55460//api/Match/GetWeeksBySeason', {
            params: { seasonId: $scope.season.Id }
        }).success(function (data) {
            $scope.weeks = data;
            $scope.getSeasonTeams();
            //TODO get current next week
            $scope.week = $scope.weeks[0];
            $scope.getweek();
        });
    };
    $scope.getSeasonTeams = function () {
        $http.get('http://localhost:55460//api/Match/GetTeamsBySeason', {
            params: { seasonId: $scope.season.Id }
        }).success(function (data) {
            $scope.teams = data;
        });
    };
    $scope.groupByDate = function groupByDate(matches) {
        var grouped = {};
        angular.forEach(matches, function (match) {
            var actualDay = new Date(match.Date - (match.Date));
            if (!grouped[actualDay]) {
                grouped[actualDay] = [];
            }
            grouped[actualDay].push(match);
        });

        return grouped;
    };
    $scope.getTeamMatches = function () {
        $scope.selectedweek = {};
        $http.get('http://localhost:55460//api/Match/GetMatchesByTeam', {
            params: { teamId: $scope.team.Id, seasonId: $scope.season.Id }
        }).success(function (data) {
            $scope.selectedweek = data;
        });

    };
    $scope.editWeek = function () {
        var matches = $scope.selectedweek;
        $http.post('http://localhost:55460//api/Match/EditAWeek', matches);

    };
    $scope.updateweek = function () {
        var matches = $scope.selectedweek;
        $http.post('http://localhost:55460//api/Match/UpdateWeek', matches);

    }
    $scope.editWeekTeams = function () {
        //TODO
        var matches = $scope.selectedweek;
        angular.forEach(matches, function (match) {
            var d2 = new Date(match.Date);
            d2.setHours(d2.getHours() + 3);
            match.Date = d2;
        });
        matches[0].WeekId = $scope.week.Id;
        matches[0].SeasonId = $scope.season.Id;
        $http.post('http://localhost:55460//api/Match/EditWeekTeams', matches)
            .success(function () {
                $scope.savedAlert();
            });

    }
    $scope.addMatch = function () {
        $http.get('http://localhost:55460//api/Match/GetEmptyMatch').success(function (data) {
            $scope.selectedweek.push(data);
        });

    };
    $scope.save = function () {
        var week = {};
        week.Number = $scope.week.Number;
        week.SeasonId = $scope.season.Id;

        Weeks.save(week, function () {
            $scope.getSeasonWeeks();
            //$scope.weeks = Weeks.query();
        });
    };
    $scope.deleteWeek = function () {
        var id = this.item.Id;
        Weeks.delete({ id: id }, function () {
            $("#item_" + id).fadeOut(500);
        });
    };
    $scope.addScorer = function (player, id) {
        //var match = $scope.selectedweek.Id;
        var match = $filter("filter")($scope.selectedweek, { Id: id.Id }, true);
        var goal = {};
        match = match[0];
        // goal.Match = match;
        goal.MatchId = match.Id;
        goal.PlayerId = player.Id;
        //goal.Player = player;
        goal.SeasonId = match.SeasonId;
        //if (match.Goals == null)
        //{
        //    match.Goals = [];
        //}
        //match.Goals.push(goal);
        //var psd = 'asdasd';
        Goals.save(goal, function () {
            //if (match.Goals == null)
            //{
            //    match.Goals = [];
            //}
            //match.Goals.push(goal);
            $scope.goals = Goals.query();
        });
    };
    $scope.getScorers = function () {
        $http.get('http://localhost:55460//api/Match/GetScorers', {
            params: { season: $scope.season.Id }
        }).success(function (data) {
            $scope.scorers = data;
        }).error(function (data) {
            $scope.items = [];
        });
    };
    $scope.savedAlert = function (e) {
        $('#saved').fadeIn('slow', function () {
            $('#saved').fadeOut('slow');
        });
    };
    $scope.nextWeek = function () {
        season = {};
        season.Id = $scope.season.Id;
        season.NextWeek = $scope.week.Id;
        $http.post('http://localhost:55460//api/Match/NextWeek', season).success(function (data) {
            alert('Added!');
        }).error(function () {
            alert('Error');
        });
    };
};
angular.module('routedTabs').controller('EditCtrl', EditCtrl);