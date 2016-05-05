var PlayerCtrl = function ($scope, CommonServices,PlayerService, Players, TeamService, $http) {
    $scope.item = {};
    $scope.items = PlayerService.allPlayers;
    $scope.teams = TeamService.teams;
    $scope.positions = PlayerService.positions;
    if ($scope.items == "undefined" || $scope.items == null || $scope.items.length == 0) {
        PlayerService.getAllPlayers();
        PlayerService.getPositions();
    }
    $scope.$watchCollection('teams', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.player.TeamId = $scope.teams[0].Id;
        }
    });
    $scope.$watchCollection('positions', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.player.PositionId = $scope.positions[0].Id;
        }
    });
    $scope.player = {};
    $scope.save = function () {
        Players.save($scope.player, function () {
            $scope.items = Players.query();
        });
    };
    $scope.register = function () {
        $scope.isProcessing = true;
        $http.post('http://domain.redlionleague.com//api/Match/PostPlayer', $scope.player).success(function () {
            PlayerService.getAllPlayers().$promise.then(function () {
                $scope.player = {};
                $scope.setTeam();
                $scope.isProcessing = false;
            });
            alert('נרשמת בהצלחה!');
        }).error(function (data) {
            alert('שגיאה! אולי טעות בקוד קבוצה');
        });
    }
    $scope.testRegister = function () {
        $scope.isProcessing = true;
        $http.post('http://domain.redlionleague.com//api/Account/Register', $scope.test).success(function () {
            alert('נרשמת בהצלחה!');
        }).error(function (data) {
            alert('שגיאה! אולי טעות בקוד קבוצה');
        });
    }
    $scope.allPlayers = PlayerService.allPlayers;
    $scope.$watchCollection('allPlayers', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.setTeam();
        }
    });

    $scope.setTeam = function () {
        var players = [];
        var allPlayers = PlayerService.allPlayers;
        angular.forEach(allPlayers, function (key, value) {
            if (key.TeamId == $scope.player.TeamId) {
                players.push(key);
            }
        });
        $scope.selectedTeam = players;
    }

    $scope.delete = function () {
        var id = this.item.Id;
        Players.delete({ id: id }, function () {
            $("#item_" + id).fadeOut(500);
        });
    };

    $scope.playerPage == function () {
        $state.go('main.player');
    };
    $scope.seasons = CommonServices.seasons;
    $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
    $scope.scorers = PlayerService.scorers;
    $scope.getScorers = function () {
        CommonServices.currentSeasonOption = $scope.seasons.indexOf($scope.season);
        PlayerService.getSeasonScorers($scope.season.Id);
    }

    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
            if (PlayerService.scorers.length == 0) {
                PlayerService.getSeasonScorers($scope.season.Id);
            }
        }
    });
    if (PlayerService.previousSeasonId != CommonServices.currentSeasonOption) {
        PlayerService.previousSeasonId = CommonServices.currentSeasonOption;
        if ($scope.season != "undefined" && $scope.season != null && $scope.season.length > 0) {
            $scope.getScorers();
        }   
        
    }
};
angular.module('routedTabs').controller('PlayerCtrl', PlayerCtrl);