var MainCtrl = function ($rootScope, $scope, CommonServices, $state) {
    $scope.state = CommonServices.state;
    CommonServices.getSeasons();
    $scope.tabs = [
        { heading: "טבלה", route: "main.table", active: false },
        { heading: "לוח משחקים", route: "main.fixtures", active: false },
        { heading: "כובשים", route: "main.scorers", active: false },
        { heading: "סטטיסטיקות", route: "main.statistics", active: false },
        //{ heading: "חדשות", route: "main.news", active: false }
    ];
    $scope.editTabs = [
        { heading: "עדכון תוצאות", route: "main.edit.weekScore", active: false },
        { heading: "עריכת מחזור", route: "main.edit.weekTeams", active: false },
        { heading: "שחקנים", route: "main.edit.players", active: false },
        { heading: "עונות", route: "main.edit.seasons", active: false },
        { heading: "קבוצות", route: "main.edit.teams", active: false }
    ];

    $scope.termTabs = [
        { heading: "מבנה הליגה", route: "main.terms.structure", active: false },
        { heading: "מועדי משחקים", route: "main.terms.schedule", active: false },
        { heading: "חוקים", route: "main.terms.rules", active: false },
        { heading: "התנהלות שחקנים", route: "main.terms.player-conduct", active: false }
    ];

    $scope.go = function (route, params) {
        //if (!($(".container-wrapper").is(':animated'))) {
        //    $('.container-wrapper').fadeOut(0, function () {
        //        $('.container-wrapper').fadeIn('fast');
        //    });
        //}

        $state.go(route, params);
    };

    $scope.active = function (route) {
        return $state.is(route);
    };

    $scope.$on("$stateChangeSuccess", function () {
        $scope.tabs.forEach(function (tab) {
            tab.active = $scope.active(tab.route);
        });
        $scope.termTabs.forEach(function (tab) {
            tab.active = $scope.active(tab.route);
        });
        $scope.editTabs.forEach(function (tab) {
            tab.active = $scope.active(tab.route);
        });
    });
    $scope.goTop = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }
};
angular.module("routedTabs").controller("MainCtrl", MainCtrl);

