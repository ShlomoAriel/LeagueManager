app.service('PlayerService', function ($http, Players) {
    var _data = this;
    _data.seasonId = -1;
    _data.seasonPlayers = [];
    _data.teamPlayers = [];
    _data.teamSeasonPlayers = [];
    _data.allPlayers = [];
    _data.player = {};
    _data.positions = [];
    _data.scorers = [];

    _data.getSeasonPlayers = function (seasonId) {
        var promise = $http.get('http://domain.redlionleague.com//api/Match/GetSeasonPlayers', {
            params: { season: seasonId }
        }).success(function (data) {
            //_data.players = data;
            angular.copy(data, _data.seasonPlayers);
        });
        return promise;
    };
    _data.getTeamPlayers = function (teamId) {
        var promise = $http.get('http://domain.redlionleague.com//api/Match/GetTeamPlayers', {
            params: { teamId: teamId }
        }).success(function (data) {
            //_data.players = data;
            angular.copy(data, _data.teamPlayers);
        });
        return promise;
    };
    _data.addPlayerToSeason = function (seasonId, playerId) {
        var seasonPlayer = {};
        seasonPlayer.SeasonId = seasonId;
        seasonPlayer.PlayerId = playerId;
        var promise = $http.post('http://domain.redlionleague.com//api/Match/AddPlayerToSeason', seasonPlayer).success(function (data) {
        });
        return promise;
    };
    _data.removePlayerFromSeason = function (seasonId, playerId) {
        var seasonPlayer = {};
        seasonPlayer.SeasonId = seasonId;
        seasonPlayer.PlayerId = playerId;
        var promise = $http.post('http://domain.redlionleague.com//api/Match/DeletePlayerFromSeason', seasonPlayer).success(function (data) {
        });
        return promise;
    }
    _data.getTeamSeasonPlayers = function (seasonId, teamId) {
        var seasonTeam = {};
        seasonTeam.SeasonId = seasonId;
        seasonTeam.TeamId = teamId;
        var promise = $http.post('http://domain.redlionleague.com//api/Match/GetTeamSeasonPlayers', seasonTeam).success(function (data) {
            //_data.players = data;
            angular.copy(data, _data.teamSeasonPlayers);
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
        var promise = $http.get('http://domain.redlionleague.com//api/Match/GetPositions')
            .success(function (data) {
                angular.copy(data, _data.positions);
            });
    }
    _data.getSeasonScorers = function (seasonId) {
        var promise = $http.get('http://domain.redlionleague.com//api/Match/GetScorers', {
            params: { season: seasonId }
        }).success(function (data) {
            _data.seasonId = seasonId;
            angular.copy(data, _data.scorers);
            //CommonServices.state.loading = false;
        });
        return promise;
    };
    _data.setSeasonId = function (seasonId) {
        _data.seasonId = seasonId;
    }
});