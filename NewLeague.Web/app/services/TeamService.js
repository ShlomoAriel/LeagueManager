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