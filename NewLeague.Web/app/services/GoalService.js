app.service('GoalService', function (Goals) {
    var _data = this;
    _data.goals = [];

    _data.getGoals = function () {
        return Goals.query(function (data) {
            angular.copy(data, _data.goals);
        });
    };
    _data.getGoals();
});