app.service('CommonServices', function (Seasons, $http, TableService, ScorerService, MatchesService,$q) {
    var _data = this;
    _data.state = {
        loading: true
    };
    _data.currentSeasonOption = 0;
    _data.currentSeasonId = 0;
    _data.seasons = [];  // this is where the shared data would go !!!!!!!controller as
    _data.nextWeekId = 0;

    _data.getSeasons = function () {
        var promise = Seasons.query(function (data) {
            angular.copy(data, _data.seasons);
            _data.currentSeasonId = data[0].Id;
            _data.nextWeekId = data[0].NextWeek;
            var one = TableService.getSeasonTable(_data.currentSeasonId);
            var two = ScorerService.getSeasonScorers(_data.currentSeasonId);
            MatchesService.setNextWeekId(_data.nextWeekId);
            var three = MatchesService.getSeasonMatches(_data.currentSeasonId);
            $q.all([one, two, three]).then(function () {
                _data.state.loading = false;
            });
            
        });
        return promise.$promise;
    };
    //_data.getSeasons();
});
app.service('TableService', function ($http, $q) {
    //CommonServices.state.loading = true;
    var _data = this;
    //_data.seasonId = CommonServices.currentSeasonOption;
    _data.previousSeasonId = 0;
    _data.table = [];
    _data.scorers = [];
    _data.nextWeek = [];


    _data.getSeasonTable = function (seasonId) {
        var promise = $http.get('http://domain.redlionleague.com/api/Match/GetStandings', {
            params: { id: seasonId }
        }).success(function (data) {
            angular.copy(data, _data.table);
            //CommonServices.state.loading = false;
        });
        return promise;
    };
});
app.service('ScorerService', function ($http) {
    //CommonServices.state.loading = true;
    var _data = this;
    _data.seasonId = -1;
    _data.scorers = [];
    _data.previousSeasonId = 0;

    _data.getSeasonScorers = function (seasonId) {
        var promise = $http.get('http://domain.redlionleague.com/api/Match/GetScorers', {
            params: { season: seasonId }
        }).success(function (data) {
            _data.seasonId = seasonId;
            angular.copy(data, _data.scorers);
            //CommonServices.state.loading = false;
        });
        return promise;
    };
    //_data.getSeasonScorers(CommonServices.currentSeasonId);
});
app.service('PlayerService', function ($http, Players) {
    var _data = this;
    _data.seasonId = -1;
    _data.players = [];
    _data.allPlayers = [];
    _data.player = {};
    _data.positions = [];

    _data.getSeasonPlayers = function (seasonId) {
        var promise = $http.get('http://domain.redlionleague.com/api/Match/GetSeasonPlayers', {
            params: { season: seasonId }
        }).success(function (data) {
            //_data.players = data;
            angular.copy(data, _data.players);
        });
        return promise;
    };
    _data.getAllPlayers = function () {
        var promise = Players.query(function (data) {
            angular.copy(data, _data.allPlayers);
        });
        return promise;
    };
    _data.getPlayer = function (playerId) {
        return Players.get({ id: playerId }, function (data) {
            angular.copy(data, _data.player);
        });
    };
    _data.getPositions = function (playerId) {
        var promise = $http.get('http://domain.redlionleague.com/api/Match/GetPositions')
            .success(function (data) {
                angular.copy(data, _data.positions);
            });
    }
    _data.setSeasonId = function (seasonId) {
        _data.seasonId = seasonId;
    }
});
app.service('TeamService', function ($http, Teams) {
    var _data = this;
    _data.teams = [];

    _data.getTeams = function () {
        return Teams.query(function (data) {
            angular.copy(data, _data.teams);
        });
    };
    _data.setSeasonId = function (seasonId) {
        _data.seasonId = seasonId;
    }
    _data.getTeams();
});
app.service('MatchesService', function ($http, Seasons, $q) {
    //CommonServices.state.loading = true;
    var _data = this;
    _data.previousSeasonId = 0;
    _data.seasonId = 0;
    _data.seasonsMatches = [];
    _data.teams = [];
    _data.weeks = [];
    _data.nextWeek = [];
    _data.nextWeekNumber = 0;
    _data.weekMatches = [];
    _data.getSeasonMatches = function (seasonId) {
        var promise =
        $http.get('http://domain.redlionleague.com/api/Match/GetMatchesBySeason', {
            params: { seasonId: seasonId }
        }).then(function (response) {
            angular.copy(response.data, _data.seasonsMatches);
            _data.seasonId = seasonId;
            _data.setNextWeek();
            _data.getSeasonWeeks(_data.seasonId);
            _data.getSeasonTeams(_data.seasonId);
        });
        return promise;
    };
    _data.setNextWeekId = function (id) {
        _data.nextWeekId = id;
    }
    _data.getSeasonWeeks = function (seasonId) {
        $http.get('http://domain.redlionleague.com/api/Match/GetWeeksBySeason', {
            params: { seasonId: seasonId }
        }).success(function (data) {
            //_data.weeks = data;
            angular.copy(data, _data.weeks);
        });
    };
    _data.getSeasonTeams = function (seasonId) {
        $http.get('http://domain.redlionleague.com/api/Match/GetTeamsBySeason', {
            params: { seasonId: seasonId }
        }).success(function (data) {
            //_data.teams = data;
            angular.copy(data, _data.teams);
        });
    };
    _data.setNextWeek = function () {
        _data.nextWeek.length=0;
        angular.forEach(_data.seasonsMatches, function (key, value) {
            if (key.WeekId == _data.nextWeekId) {
                _data.nextWeek.push(key);
            }
        });
        if (_data.nextWeek.length) {
            _data.NextWeekNumber = _data.nextWeek[0].Week.Number;

        }
    }
    _data.getMatchByWeek = function (seasonId, weekId) {
        $http.get('http://domain.redlionleague.com/api/Match/GetMatchesByWeek', {
            params: { week: weekId, seasonId: seasonId }
        }).success(function (data) {
            //_data.teams = data;
            angular.copy(data, _data.weekMatches);
        });
    };


    _data.setSeasonId = function (seasonId) {
        _data.seasonId = seasonId;
    }

    //_data.getSeasonMatches(1);
    //_data.getSeasonWeeks(_data.seasonId);
    //_data.getSeasonTeams(_data.seasonId);
});
app.service('GoalService', function (Goals) {
    var _data = this;
    _data.goals = [];

    _data.getGoals = function () {
        return Goals.query(function (data) {
            angular.copy(data, _data.goals);
        });
    };
    _data.getGoals();
});