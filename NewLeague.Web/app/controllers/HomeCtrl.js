var HomeCtrl = function ($scope, CommonServices, TableService) {
    $scope.seasons = CommonServices.seasons;
    $scope.items = TableService.table;
    $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
        }
    });
    $scope.stopLoading = function () {
        //CommonServices.state.loading = false;
    }
    if (TableService.previousSeasonId != CommonServices.currentSeasonOption) {
        CommonServices.currentSeasonOption = $scope.seasons.indexOf($scope.season);
        TableService.getSeasonTable($scope.season.Id);
        TableService.previousSeasonId = CommonServices.currentSeasonOption;
    }
    $scope.getStandings = function () {
        CommonServices.currentSeasonOption = $scope.seasons.indexOf($scope.season);
        TableService.previousSeasonId = CommonServices.currentSeasonOption;//?
        TableService.getSeasonTable($scope.season.Id);
    }
}