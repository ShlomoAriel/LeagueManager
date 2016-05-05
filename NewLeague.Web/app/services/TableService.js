app.service('TableService', function ($http, $q) {
    var _data = this;
    _data.previousSeasonId = 0;
    _data.table = [];
    _data.scorers = [];
    _data.nextWeek = [];
    _data.getSeasonTable = function (seasonId) {
        var promise = $http.get('http://domain.redlionleague.com//api/Match/GetStandings', {
            params: { id: seasonId }
        }).success(function (data) {
            angular.copy(data, _data.table);
        });
        return promise;
    };
});