app.service('TableService', function ($http, $q) {
    //CommonServices.state.loading = true;
    var _data = this;
    //_data.seasonId = CommonServices.currentSeasonOption;
    _data.previousSeasonId = 0;
    _data.table = [];
    _data.scorers = [];
    _data.nextWeek = [];


    _data.getSeasonTable = function (seasonId) {
        var promise = $http.get('http://localhost:55460//api/Match/GetStandings', {
            params: { id: seasonId }
        }).success(function (data) {
            angular.copy(data, _data.table);
            //CommonServices.state.loading = false;
        });
        return promise;
    };
});