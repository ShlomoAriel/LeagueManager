var PlayerCtrl = function ($scope, PlayerService, Players, TeamService, $http) {
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

    //redlion.somee.com
    $scope.player = {};
    $scope.save = function () {
        //var player = {};
        // player.Name = $scope.player.Name;
        // player.TeamId = $scope.player.TeamId.Id;


        Players.save($scope.player, function () {
            $scope.items = Players.query();
        });
    };
    $scope.register = function () {
        $scope.isProcessing = true;
        $http.post('http://localhost:55460//api/Match/PostPlayer', $scope.player).success(function () {
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
};
angular.module('routedTabs').controller('PlayerCtrl', PlayerCtrl);