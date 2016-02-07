app.service('ScorerService', function ($http) {
    //CommonServices.state.loading = true;
    var _data = this;
    _data.seasonId = -1;
    _data.scorers = [];
    _data.previousSeasonId = 0;

    _data.getSeasonScorers = function (seasonId) {
        var promise = $http.get('http://localhost:55460//api/Match/GetScorers', {
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