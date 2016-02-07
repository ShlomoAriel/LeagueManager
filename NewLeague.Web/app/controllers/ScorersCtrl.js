var ScorersCtrl = function ($scope, CommonServices, ScorerService) {
    $scope.seasons = CommonServices.seasons;
    $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
    $scope.scorers = ScorerService.scorers;
    $scope.getScorers = function () {
        CommonServices.currentSeasonOption = $scope.seasons.indexOf($scope.season);
        ScorerService.getSeasonScorers($scope.season.Id);
    }

    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
            if (ScorerService.scorers.length == 0) {
                ScorerService.getSeasonScorers($scope.season.Id);
            }
        }
    });
    if (ScorerService.previousSeasonId != CommonServices.currentSeasonOption) {
        $scope.getScorers();
        ScorerService.previousSeasonId = CommonServices.currentSeasonOption;
    }
};
angular.module('routedTabs').controller('ScorersCtrl', ScorersCtrl);