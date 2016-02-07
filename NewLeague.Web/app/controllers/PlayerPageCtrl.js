var PlayerPageCtrl = function ($scope, PlayerService, $stateParams) {
    var playerId = $stateParams.Id;
    PlayerService.getPlayer(playerId);
    $scope.player = PlayerService.player;

};