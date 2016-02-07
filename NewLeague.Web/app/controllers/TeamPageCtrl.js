var TeamPageCtrl = function ($scope, Teams, $state, $stateParams, TableService, CommonServices, PlayerService) {
    $scope.teamId = $stateParams.Id;
    $scope.teamPlayers = PlayerService.teamPlayers;
    $scope.teamSeasonPlayers = PlayerService.teamSeasonPlayers;
    $scope.positions = PlayerService.positions;
    $scope.seasons = CommonServices.seasons;
    $scope.teams = TableService.table;
    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
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
        }
    });


    $scope.team = {};
    $scope.$watchCollection("teams", function (newValue, oldValue) {
        if (newValue.length) {
            $scope.setTeamStats();
        }
    });

    $scope.getTeamSeasonPlayers = function () {
        CommonServices.currentSeasonOption = $scope.seasons.indexOf($scope.season);
        $scope.getStandings();
        PlayerService.getTeamPlayers($scope.teamId).then(function() {
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
    $scope.getStandings = function () {
        CommonServices.currentSeasonOption = $scope.seasons.indexOf($scope.season);
        TableService.previousSeasonId = CommonServices.currentSeasonOption;//?
        TableService.getSeasonTable($scope.season.Id);
    }
    $scope.setTeamStats = function () {
        angular.forEach($scope.teams, function (key) {
            if (key.Id == $scope.teamId) {
                $scope.team = key;
                $scope.end = $scope.team.MatchForm.length;
                if ($scope.end > 4) {
                    $scope.start = $scope.end - 5;
                } else {
                    $scope.start = 0;
                }
                $scope.recentGoalsFor = 0;
                $scope.recentGoalsAgainst = 0;
                $scope.recentGoalsDifference = 0;
                $scope.recentPoints = 0;
                for (var i = $scope.start; i < $scope.end; i++) {
                    $scope.recentGoalsFor += $scope.team.MatchForm[i].GoalsFor;
                    $scope.recentGoalsAgainst += $scope.team.MatchForm[i].GoalsAgainst;
                    if ($scope.team.MatchForm[i].GoalsFor > $scope.team.MatchForm[i].GoalsAgainst) {
                        $scope.recentPoints += 3;
                    }
                    else if ($scope.team.MatchForm[i].GoalsFor == $scope.team.MatchForm[i].GoalsAgainst) {
                        $scope.recentPoints += 1;
                    }

                }
                $scope.recentGoalsDifference = $scope.recentGoalsFor - $scope.recentGoalsAgainst;
            }
        });
    }
    $scope.filterPlayers = function() {
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
    //$scope.team = Teams.get({ id: teamId }, function () {
    //    $scope.end = $scope.team.MatchForm.length;
    //    $scope.start = $scope.end - 5;
    //    $scope.recentGoalsFor = 0;
    //    $scope.recentGoalsAgainst = 0;
    //    $scope.recentGoalsDifference = 0;
    //    $scope.recentPoints = 0;
    //    for (var i = $scope.start; i < $scope.end; i++) {
    //        $scope.recentGoalsFor += $scope.team.MatchForm[i].GoalsFor;
    //        $scope.recentGoalsAgainst += $scope.team.MatchForm[i].GoalsAgainst;
    //        if ($scope.recentGoalsFor > $scope.recentGoalsAgainst)
    //        {
    //            $scope.recentPoints += 3;
    //        }
    //        else if ($scope.recentGoalsFor == $scope.recentGoalsAgainst)
    //        {
    //            $scope.recentPoints += 1;
    //        }

    //    }
    //    $scope.recentGoalsDifference = $scope.recentGoalsFor - $scope.recentGoalsAgainst;
    //});




};