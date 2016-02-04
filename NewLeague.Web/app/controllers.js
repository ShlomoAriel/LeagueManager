var HomeCtrl = function ($scope, CommonServices, TableService, $anchorScroll, $timeout, $state){
    $scope.seasons = CommonServices.seasons;
    $scope.items = TableService.table;
    $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
            //if (TableService.table.length == 0) {
            //    TableService.getSeasonTable(CommonServices.currentSeasonId).then(function () {
                    
            //    });
            //}
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

var FixtureCtrl = function ($scope, CommonServices, MatchesService, GoalService) {
    $scope.openScorers = function(id){
        $('#matchId_' + id).slideToggle();
    }

    $scope.goals = GoalService.goals;
    $scope.getweek = function () {
        var weeks = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.WeekId == $scope.week.Id) {
                weeks.push(key);
            }
        });
        $scope.selectedweek = weeks;
        CommonServices.state.loading = false;
    };

    $scope.seasonOptionChanged = function () {
        CommonServices.currentSeasonOption = $scope.seasons.indexOf($scope.season);//?
        MatchesService.previousSeasonId = CommonServices.currentSeasonOption;//?
        $scope.getSeasonData();
    }

    $scope.getSeasonData = function () {
        MatchesService.getSeasonMatches($scope.season.Id).then(function () {
            MatchesService.nextWeek = $scope.getWeekById(CommonServices.seasons[CommonServices.currentSeasonOption].NextWeek);
            $scope.week = $scope.weeks[0];
            $scope.getweek()
        });
        MatchesService.getSeasonWeeks($scope.season.Id);
        MatchesService.getSeasonTeams($scope.season.Id);
    }

    $scope.teams = MatchesService.teams;
    $scope.weeks = MatchesService.weeks;
    $scope.comingWeek = MatchesService.nextWeek;
    $scope.NextWeekNumber = MatchesService.NextWeekNumber;
    $scope.matches = MatchesService.seasonsMatches;
    $scope.seasons = CommonServices.seasons;
    $scope.season = $scope.seasons[CommonServices.currentSeasonOption];//?
    $scope.seasonId = MatchesService.seasonId;
    $scope.week = $scope.weeks[0];

    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
            if (MatchesService.seasonsMatches.length == 0) {
                $scope.season = CommonServices.seasons[CommonServices.currentSeasonOption];//?
                $scope.getSeasonData();
            }
            else {
                $scope.getweek();
            }

        }
    });
    $scope.$watchCollection('weeks', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.week = $scope.weeks[0];
        }
    });

    if (MatchesService.previousSeasonId != CommonServices.currentSeasonOption) {
        $scope.getSeasonData();
        MatchesService.previousSeasonId = CommonServices.currentSeasonOption;
    }
    $scope.getWeekById = function (id) {
        MatchesService.nextWeek = [];
        $scope.comingWeek = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.WeekId == id) {
                $scope.comingWeek.push(key);
            }
        });
        if ($scope.comingWeek.length) {
            MatchesService.NextWeekNumber = $scope.NextWeekNumber = $scope.comingWeek[0].Week.Number;

        }
        return $scope.comingWeek;
    };

    $scope.getNextWeek = function (weeks) {
        var found = false;
        var keepGoing = true;
        angular.forEach(weeks, function (key, value) {
            if (keepGoing) {
                if (found == true) {
                    keepGoing = false;
                    //$scope.week.Id = key.Id;
                    $scope.week = key;
                    $scope.getweek();
                }
                if (key.Id == $scope.week.Id) {
                    found = true;
                }
            }
        });
    };
    $scope.nextWeek = function () {
        $scope.getNextWeek($scope.weeks);
    };
    $scope.prevWeek = function () {
        var found = false;
        var keepGoing = true;
        var weeks = $scope.weeks;
        for (var i = weeks.length - 1; i >= 0; i--) {
            var key = weeks[i];
            if (keepGoing) {
                if (found == true) {
                    keepGoing = false;
                    //$scope.week.Id = key.Id;
                    $scope.week = key;
                    $scope.getweek();
                }
                if (key.Id == $scope.week.Id) {
                    found = true;
                }
            }
        }
    };
    $scope.getTeamMatches = function () {
        var weeks = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.HomeId == $scope.team.Id || key.AwayId == $scope.team.Id) {
                weeks.push(key);
            }
        });
        $scope.selectedweek = weeks;
    }
    $scope.getweek();
};

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

var TeamCtrl = function ($scope, Teams,TeamService, $http) {
    $scope.teams = TeamService.teams;


    $scope.deleteTeam = function () {
        var id = this.item.Id;
        Teams.delete({ id: id }, function () {
            $("#item_" + id).fadeOut(500);
        });
    };
    $scope.editTeam = function () {
        var team = {};
        team.Id = $scope.team.Id;
        team.Name = $scope.team.Name;
        var data = {
            id: team.Id,
            team: team
        };
        Teams.update(data, function () {
            alert('עודכן');
        });
    }

    $scope.save = function () {
        var team = {};
        team.Name = $scope.team.Name;

        Teams.save(team, function () {
            $scope.teams = Teams.query();
        });
    };
    $scope.addTeamCode = function () {
        $http.post('http://domain.redlionleague.com/api/Match/AddTeamCode', $scope.teamCode).success(function (data) {
            alert('Team Code Added');
        }).error(function () {
            alert('Error');
        });
    }
    
};

var PlayerPageCtrl = function ($scope, PlayerService, $stateParams) {
    var playerId = $stateParams.Id;
    PlayerService.getPlayer(playerId);
    $scope.player = PlayerService.player;

};

var TeamPageCtrl = function ($scope, Teams, $state, $stateParams, TableService, CommonServices, PlayerService) {
    var teamId = $stateParams.Id;
    $scope.setTeam = function () {
        var players = [];
        var allPlayers = PlayerService.allPlayers;
        angular.forEach(allPlayers, function (key, value) {
            if (key.TeamId == teamId) {
                players.push(key);
            }
        });
        $scope.selectedTeam = players;
    }
    $scope.seasons = CommonServices.seasons;
    $scope.teams = TableService.table;
    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[CommonServices.currentSeasonOption];
            if (TableService.table.length == 0) {
                TableService.getSeasonTable(CommonServices.currentSeasonId);
            }
        }
    });
    if (PlayerService.allPlayers.length === 0) {
        PlayerService.getAllPlayers().$promise.then(function () {
            $scope.setTeam();
        });
    }
    else {
        $scope.setTeam();
    }
    
    $scope.team = {};
    $scope.$watchCollection("teams", function (newValue, oldValue) {
        if (newValue.length) {
            angular.forEach($scope.teams, function (key) {
                if (key.Id == teamId) {
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
    });
    

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

var SeasonCtrl = function ($scope, $location, Seasons, CommonServices, TeamService, $rootScope, $state, $stateParams, $http) {
    if (CommonServices.seasons.length == 0) {
        CommonServices.getSeasons().then(function () {
            $scope.season = CommonServices.seasons[CommonServices.currentSeasonOption];//?
        });
    }
    $scope.seasons = CommonServices.seasons;
    $scope.teams = TeamService.teams;


    $scope.deleteSeason = function () {
        var id = this.item.Id;
        Seasons.delete({ id: id }, function () {
            $("#item_" + id).fadeOut(500);
        });
    };

    $scope.save = function () {
        var season = {};
        season.Name = $scope.season.Name;

        Seasons.save(season, function () {
            $scope.seasons = Seasons.query();
        });
    };
    $scope.savedAlert = function (e) {
        $('.added').fadeIn('slow', function () {
            $('.added').fadeOut('slow');
        });
    };
    $scope.deletedAlert = function (e) {
        $('.deleted').fadeIn('slow', function () {
            $('.deleted').fadeOut('slow');
        });
    };
    $scope.addTeamToSeason = function () {
        var SeasonTeam = {};
        SeasonTeam.SeasonId = $scope.season.Id;
        SeasonTeam.TeamId = $scope.team.Id;

        $http.post('http://domain.redlionleague.com/api/Match/AddTeamToSeason', SeasonTeam).success(function (data) {
            CommonServices.getSeasons();
            $scope.savedAlert();
        }).error(function () {
            alert('Error');
        });
        
    }; $scope.deleteTeamFromSeason = function () {
        var seasonTeam = {};
        seasonTeam.SeasonId = this.item.Id;
        seasonTeam.TeamId = this.team.Id;
        $http.post('http://domain.redlionleague.com/api/Match/DeleteTeamFromSeason', seasonTeam).success(function () {
            CommonServices.getSeasons();
            $scope.deletedAlert();
            $("#seasonteam_" + seasonTeam.TeamId).fadeOut(500);
        });
            
    }
};

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
        $http.post('http://domain.redlionleague.com/api/Match/PostPlayer', $scope.player).success(function () {
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

var EditFixtureCtrl = function ($scope, PlayerService, Goals, MatchesService, GoalService, CommonServices, $http, $filter) {
    if (CommonServices.seasons.length == 0) {
        CommonServices.getSeasons().then(function () {
            $scope.season = CommonServices.seasons[CommonServices.currentSeasonOption];//?
        });
    }
    $scope.players = PlayerService.players;
    $scope.seasonId = MatchesService.seasonId;
    $scope.matches = MatchesService.seasonsMatches;
    $scope.weeks = MatchesService.weeks;
    $scope.seasons = CommonServices.seasons;
    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[0];
            PlayerService.getSeasonPlayers(CommonServices.currentSeasonId);
        }
    });
    $scope.$watchCollection('matches', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.week = $scope.weeks[0];
            $scope.getweek();
        }
    });
    if ($scope.players == "undefined" || $scope.players == null || $scope.players.length == 0) {
        PlayerService.getSeasonPlayers(CommonServices.currentSeasonId);
    }
    $scope.goals = GoalService.goals;

    $scope.getweek = function () {
        //   $('#fixture-wrapper').fadeOut();
        var weeks = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.WeekId == $scope.week.Id) {
                weeks.push(key);
            }
        });
        $scope.selectedweek = weeks;
        // $('#fixture-wrapper').fadeIn();
    };
    $scope.editWeek = function () {
        var matches = $scope.selectedweek;
        $http.post('http://domain.redlionleague.com/api/Match/EditAWeek', matches);
    };
    $scope.updateweek = function () {
        var matches = $scope.selectedweek;
        //angular.forEach(matches, function (match) {
        //    angular.forEach($scope.goals, function (goal) {
        //        if(match.Id==goal.MatchId)
        //        {
        //            match.Goals.push(goal);
        //        }
        //    });
        //});
        $http.post('http://domain.redlionleague.com/api/Match/UpdateWeek', matches);
    }
    $scope.fixture = {};
    $scope.addHomeScorer = function () {
        var match = this.fixture;
        var goal = {};
        goal.MatchId = match.Id;
        goal.PlayerId = this.homeScorer.Id;
        goal.SeasonId = match.SeasonId;
        Goals.save(goal, function () {
            $scope.goals = GoalService.getGoals();
        });
    };
    $scope.addAwayScorer = function () {
        var match = this.fixture;
        var goal = {};
        goal.MatchId = match.Id;
        goal.PlayerId = this.awayScorer.Id;
        goal.SeasonId = match.SeasonId;
        Goals.save(goal, function () {
            $scope.goals = GoalService.getGoals();
        });
    };
    $scope.savedAlert = function (e) {
        $('#saved').fadeIn('slow', function () {
            $('#saved').fadeOut('slow');
        });
    };
    $scope.getSeasonWeeks = function () {
        MatchesService.getSeasonMatches($scope.season.Id);
        MatchesService.getSeasonWeeks($scope.season.Id);
        MatchesService.getSeasonTeams($scope.season.Id);
    };
    $scope.deleteGoal = function () {
        var id = this.goal.Id;
        Goals.delete({ id: id }, function () {
            $("#goal_" + id).fadeOut(500);
        });
    };
};

var EditWeekCtrl = function ($scope, TeamService, Weeks, Matches, MatchesService, CommonServices, $http) {
    if (CommonServices.seasons.length == 0) {
        CommonServices.getSeasons().then(function () {
            $scope.season = CommonServices.seasons[CommonServices.currentSeasonOption];//?
        });
    }
    $scope.seasons = CommonServices.seasons;
    $scope.seasonId = MatchesService.seasonId;
    $scope.$watchCollection('seasons', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[0];
        }
    });

    $scope.matches = MatchesService.seasonsMatches;
    $scope.teams = TeamService.teams;
    $scope.weeks = MatchesService.weeks;
    $scope.hourStep = 1;
    $scope.minuteStep = 15;
    $scope.showMeridian = false;
    $scope.getweek = function () {
        //   $('#fixture-wrapper').fadeOut();
        var weeks = [];
        angular.forEach($scope.matches, function (key, value) {
            if (key.WeekId == $scope.week.Id) {
                weeks.push(key);
            }
        });
        $scope.selectedweek = weeks;
        // $('#fixture-wrapper').fadeIn();
    };

    $scope.getSeasonWeeks = function () {
        MatchesService.getSeasonMatches($scope.season.Id);
        MatchesService.getSeasonWeeks($scope.season.Id);
        MatchesService.getSeasonTeams($scope.season.Id);
    };
    $scope.$watchCollection('weeks', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.week = $scope.weeks[0];
            $scope.getweek();
        }
    });
    $scope.$watchCollection('matches', function (newValue, oldValue) {
        if (newValue.length) {
            $scope.season = $scope.seasons[0];
            $scope.week = $scope.weeks[0];
            $scope.getweek();
        }
    });
    $scope.editWeekTeams = function () {
        //TODO
        var matches = $scope.selectedweek;
        angular.forEach(matches, function (match) {
            var d2 = new Date(match.Date);
            //d2.setHours(d2.getHours() + 3);
            match.Date = d2;
        });
        matches[0].WeekId = $scope.week.Id;
        matches[0].SeasonId = $scope.season.Id;
        $http.post('http://domain.redlionleague.com/api/Match/EditWeekTeams', matches)
            .success(function () {
                $scope.savedAlert();
            });

    }
    $scope.addMatch = function () {
        $http.get('http://domain.redlionleague.com/api/Match/GetEmptyMatch').success(function (data) {
            $scope.selectedweek.push(data);
        });

    };
    $scope.save = function () {
        var week = {};
        week.Number = $scope.week.Number;
        week.SeasonId = $scope.season.Id;

        Weeks.save(week, function () {
            $scope.getSeasonWeeks();
            //$scope.weeks = Weeks.query();
        });
    };
    $scope.deleteWeek = function () {
        var id = this.item.Id;
        Weeks.delete({ id: id }, function () {
            $("#item_" + id).fadeOut(500);
        });
    };
    $scope.deleteMatch = function () {
        var id = this.fixture.Id;
        Matches.delete({ id: id }, function () {
            $("#fixture_" + id).fadeOut(500);
            MatchesService.getSeasonMatches($scope.season.Id);

        });
    };
    $scope.savedAlert = function (e) {
        $('#saved').fadeIn('slow', function () {
            $('#saved').fadeOut('slow');
        });
    };
    $scope.nextWeek = function () {
        season = {};
        season.Id = $scope.season.Id;
        season.NextWeek = $scope.week.Id;
        $http.post('http://domain.redlionleague.com/api/Match/NextWeek', season).success(function (data) {
            alert('Added!');
        }).error(function () {
            alert('Error');
        });
    };
};

var EditCtrl = function ($scope, Players, Teams, Weeks, Goals, Matches, Seasons, $timeout, $compile, $element, $http, $filter) {
    $scope.players = Players.query();
    $scope.scorers = [];
    $scope.seasons = Seasons.query(function () {
        $scope.season = $scope.seasons[0];
        $scope.fixtureWeekAndScorers();
    });
    $scope.teams = [];//Teams.query();
    $scope.weeks = [];//Weeks.query();
    $scope.goals = Goals.query();
    $scope.hourStep = 1;
    $scope.minuteStep = 15;
    $scope.showMeridian = false;
    ////$scope.item.selected = undefined;
    //$scope.dateTimeNow = function () {
    //    var date = new Date();
    //    //date.setHours(0, 0);
    //    $scope.date = date;
    //};
    //$scope.dateTimeNow();


    $scope.add = function () {
        var el = $compile("<test text='now'></test>")($scope);
        var wrapper = $element.find('#week-wrapper');
        wrapper.append(el);
    };
    $scope.getweek = function () {
        $scope.selectedweek = {};
        $http.get('http://domain.redlionleague.com/api/Match/GetMatchesByWeek', {
            params: { week: $scope.week.Id, seasonId: $scope.season.Id }
        }).success(function (data) {
            //matches = $scope.groupByDate(data);
            //$scope.selectedweek = matches;
            $scope.selectedweek = data;
        });
    };
    $scope.fixtureWeekAndScorers = function () {
        $scope.getSeasonWeeks();
        $scope.getScorers();
    };
    $scope.getSeasonWeeks = function () {
        $http.get('http://domain.redlionleague.com/api/Match/GetWeeksBySeason', {
            params: { seasonId: $scope.season.Id }
        }).success(function (data) {
            $scope.weeks = data;
            $scope.getSeasonTeams();
            //TODO get current next week
            $scope.week = $scope.weeks[0];
            $scope.getweek();
        });
    };
    $scope.getSeasonTeams = function () {
        $http.get('http://domain.redlionleague.com/api/Match/GetTeamsBySeason', {
            params: { seasonId: $scope.season.Id }
        }).success(function (data) {
            $scope.teams = data;
        });
    };
    $scope.groupByDate = function groupByDate(matches) {
        var grouped = {};
        angular.forEach(matches, function (match) {
            var actualDay = new Date(match.Date - (match.Date));
            if (!grouped[actualDay]) {
                grouped[actualDay] = [];
            }
            grouped[actualDay].push(match);
        });

        return grouped;
    };
    $scope.getTeamMatches = function () {
        $scope.selectedweek = {};
        $http.get('http://domain.redlionleague.com/api/Match/GetMatchesByTeam', {
            params: { teamId: $scope.team.Id, seasonId: $scope.season.Id }
        }).success(function (data) {
            $scope.selectedweek = data;
        });

    };
    $scope.editWeek = function () {
        var matches = $scope.selectedweek;
        $http.post('http://domain.redlionleague.com/api/Match/EditAWeek', matches);

    };
    $scope.updateweek = function () {
        var matches = $scope.selectedweek;
        $http.post('http://domain.redlionleague.com/api/Match/UpdateWeek', matches);

    }
    $scope.editWeekTeams = function () {
        //TODO
        var matches = $scope.selectedweek;
        angular.forEach(matches, function (match) {
            var d2 = new Date(match.Date);
            d2.setHours(d2.getHours() + 3);
            match.Date = d2;
        });
        matches[0].WeekId = $scope.week.Id;
        matches[0].SeasonId = $scope.season.Id;
        $http.post('http://domain.redlionleague.com/api/Match/EditWeekTeams', matches)
            .success(function () {
                $scope.savedAlert();
            });

    }
    $scope.addMatch = function () {
        $http.get('http://domain.redlionleague.com/api/Match/GetEmptyMatch').success(function (data) {
            $scope.selectedweek.push(data);
        });

    };
    $scope.save = function () {
        var week = {};
        week.Number = $scope.week.Number;
        week.SeasonId = $scope.season.Id;

        Weeks.save(week, function () {
            $scope.getSeasonWeeks();
            //$scope.weeks = Weeks.query();
        });
    };
    $scope.deleteWeek = function () {
        var id = this.item.Id;
        Weeks.delete({ id: id }, function () {
            $("#item_" + id).fadeOut(500);
        });
    };
    $scope.addScorer = function (player, id) {
        //var match = $scope.selectedweek.Id;
        var match = $filter("filter")($scope.selectedweek, { Id: id.Id }, true);
        var goal = {};
        match = match[0];
        // goal.Match = match;
        goal.MatchId = match.Id;
        goal.PlayerId = player.Id;
        //goal.Player = player;
        goal.SeasonId = match.SeasonId;
        //if (match.Goals == null)
        //{
        //    match.Goals = [];
        //}
        //match.Goals.push(goal);
        //var psd = 'asdasd';
        Goals.save(goal, function () {
            //if (match.Goals == null)
            //{
            //    match.Goals = [];
            //}
            //match.Goals.push(goal);
            $scope.goals = Goals.query();
        });
    };
    $scope.getScorers = function () {
        $http.get('http://domain.redlionleague.com/api/Match/GetScorers', {
            params: { season: $scope.season.Id }
        }).success(function (data) {
            $scope.scorers = data;
        }).error(function (data) {
            $scope.items = [];
        });
    };
    $scope.savedAlert = function (e) {
        $('#saved').fadeIn('slow', function () {
            $('#saved').fadeOut('slow');
        });
    };
    $scope.nextWeek = function () {
        season = {};
        season.Id = $scope.season.Id;
        season.NextWeek = $scope.week.Id;
        $http.post('http://domain.redlionleague.com/api/Match/NextWeek', season).success(function (data) {
            alert('Added!');
        }).error(function () {
            alert('Error');
        });
    };
};

var MainCtrl = function ($rootScope, $scope, CommonServices, $state) {
    $scope.state = CommonServices.state;
    CommonServices.getSeasons();
    $scope.tabs = [
        { heading: "טבלה", route: "main.table", active: false },
        { heading: "לוח משחקים", route: "main.fixtures", active: false },
        { heading: "כובשים", route: "main.scorers", active: false },
        { heading: "סטטיסטיקות", route: "main.statistics", active: false },
        //{ heading: "עדכון", route: "main.edit", active: false},
    ];
    $scope.editTabs = [
        { heading: "עדכון תוצאות", route: "main.edit.fixture", active: false },
        { heading: "עריכת מחזור", route: "main.edit.weekTeams", active: false },
        { heading: "שחקנים", route: "main.edit.players", active: false },
        { heading: "עונות", route: "main.edit.seasons", active: false },
        { heading: "קבוצות", route: "main.edit.teams", active: false }
    ];

    $scope.termTabs = [
        { heading: "מבנה הליגה", route: "main.terms.structure", active: false },
        { heading: "מועדי משחקים", route: "main.terms.schedule", active: false },
        { heading: "חוקים", route: "main.terms.rules", active: false },
        { heading: "התנהלות שחקנים", route: "main.terms.player-conduct", active: false },
    ];

    $scope.go = function (route,params) {
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

};

angular.module('routedTabs').controller('MainCtrl', MainCtrl);
angular.module('routedTabs').controller('TeamCtrl', TeamCtrl);
angular.module('routedTabs').controller('SeasonCtrl', SeasonCtrl);
angular.module('routedTabs').controller('PlayerPageCtrl', PlayerPageCtrl);
angular.module('routedTabs').controller('PlayerCtrl', PlayerCtrl);
angular.module('routedTabs').controller('EditCtrl', EditCtrl);
angular.module('routedTabs').controller('ScorersCtrl', ScorersCtrl);