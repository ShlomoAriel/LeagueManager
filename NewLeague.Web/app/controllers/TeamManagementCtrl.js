var TeamManagementCtrl = function ($scope, authService, Teams, $state, $stateParams, Players, TableService, CommonServices, PlayerService) {
    $scope.getCurrentUserTeamId = function () {
        
        authService.getTeamId().then(function (response) {
            if (response.data == '') {  //flags admin
                $scope.teamId =$stateParams.Id
            }
            else {
                $scope.teamId = response.data;
            }
            
        });
    }
    $scope.getCurrentUserTeamId();
    //$scope.teamId = $stateParams.Id;
    $scope.$watch('teamId', function () {
        if (!angular.isUndefined($scope.teamId)) {
            $scope.updateSeasonInfo();
        }
    });
    $scope.save = function () {
        $scope.player.TeamId = $scope.teamId;
        Players.save($scope.player, function () {
            PlayerService.getTeamPlayers($scope.teamId);
        });
    };
    $scope.teamPlayers = PlayerService.teamPlayers;
    $scope.teamSeasonPlayers = PlayerService.teamSeasonPlayers;
    $scope.positions = PlayerService.positions;
    $scope.seasons = CommonServices.seasons;
    $scope.teams = TableService.table;
    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            if (!angular.isUndefined($scope.teamId)) {
                $scope.updateSeasonInfo();
            }
        }
    });

    $scope.updateSeasonInfo = function () {
        $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
        if (TableService.table.length === 0) {
            TableService.getSeasonTable(CommonServices.currentSeasonId);
        }
        if (PlayerService.teamPlayers.length === 0) {
            PlayerService.getTeamPlayers($scope.teamId);
        }
        if (PlayerService.positions.length === 0) {
            PlayerService.getPositions();
        }
        if (PlayerService.teamSeasonPlayers.length === 0) {
            PlayerService.getTeamSeasonPlayers(CommonServices.currentSeasonId, $scope.teamId).then(function () {
                $scope.filterPlayers();
            });
        }
    };
    $scope.team = {};

    $scope.getTeamSeasonPlayers = function () {
        CommonServices.currentSeasonOption = $scope.seasons.indexOf($scope.season);
        PlayerService.getTeamPlayers($scope.teamId).then(function () {
            PlayerService.getTeamSeasonPlayers($scope.season.Id, $scope.teamId).then(function () {
                $scope.filterPlayers();
            });
        });

    }
    $scope.addPlayerToSeason = function (player) {
        PlayerService.addPlayerToSeason($scope.season.Id, player.Id)
            .then(function () {
                $scope.teamSeasonPlayers.push(player);
                $scope.teamPlayers.splice($.inArray(player, $scope.teamPlayers), 1);

                //$("#team_player" + player.Id).fadeOut(500);
            });
    }
    $scope.removePlayerFromSeason = function (player) {
        PlayerService.removePlayerFromSeason($scope.season.Id, player.Id)
            .then(function () {
                $scope.teamSeasonPlayers.splice($.inArray(player, $scope.teamSeasonPlayers), 1);
                //$("#season_player" + player.Id).fadeOut(500);
                $scope.teamPlayers.push(player);
            });
    }
    $scope.filterPlayers = function () {
        for (var i = 0; i < $scope.teamPlayers.length; i++) {
            for (var j = 0; j < $scope.teamSeasonPlayers.length; j++) {
                if ($scope.teamSeasonPlayers[j].Id === $scope.teamPlayers[i].Id) {
                    $scope.teamPlayers.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }




};