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
        $http.get('http://domain.redlionleague.com//api/Match/GetMatchesBySeason', {
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
        $http.get('http://domain.redlionleague.com//api/Match/GetWeeksBySeason', {
            params: { seasonId: seasonId }
        }).success(function (data) {
            //_data.weeks = data;
            angular.copy(data, _data.weeks);
        });
    };
    _data.getSeasonTeams = function (seasonId) {
        $http.get('http://domain.redlionleague.com//api/Match/GetTeamsBySeason', {
            params: { seasonId: seasonId }
        }).success(function (data) {
            //_data.teams = data;
            angular.copy(data, _data.teams);
        });
    };
    _data.setNextWeek = function () {
        _data.nextWeek.length = 0;
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
        $http.get('http://domain.redlionleague.com//api/Match/GetMatchesByWeek', {
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