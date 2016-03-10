app.service('CommonServices', function (Seasons, $http, TableService, PlayerService, MatchesService, $q) {
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
            var two = PlayerService.getSeasonScorers(_data.currentSeasonId);
            MatchesService.setNextWeekId(_data.nextWeekId);
            var three = MatchesService.getSeasonMatches(_data.currentSeasonId);
            $q.all([one, two, three]).then(function () {
                _data.state.loading = false;
            });

        });
        return promise.$promise;
    };
});