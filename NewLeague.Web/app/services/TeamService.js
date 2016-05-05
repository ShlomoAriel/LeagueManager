app.service('TeamService', function ($http, Teams) {
    var _data = this;
    _data.teams = [];
    _data.seasonTeams = [];

    _data.getTeams = function () {
        return Teams.query(function (data) {
            angular.copy(data, _data.teams);
        });
    };
    _data.getSeasonTeams = function (seasonId) {
        var promise = $http.get('http://domain.redlionleague.com//api/Match/GetSeasonTeams', {
            params: { season: seasonId }
        }).success(function (data) {
            angular.copy(data, _data.seasonTeams);
        });
        return promise;
    };
    _data.setSeasonId = function (seasonId) {
        _data.seasonId = seasonId;
    }
    _data.getTeams();
});