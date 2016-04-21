using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using NewLeague.Models;
using NewLeague.Domain.Models.NewLeague;
using NewLeague.Domain.Models;
using System.Web.Http.Cors;
using AutoMapper;

namespace NewLeague.Domain.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MatchController : ApiController
    {
        private DomainContext db = new DomainContext();

        // GET api/Match
        public IEnumerable<Match> GetMatches()
        {
            return db.Matches.ToList();
        }
        [ActionName("GetMatchesByWeek")]
        [HttpGet]
        public HttpResponseMessage GetMatchesByWeek(int week, int seasonId)
        {
            var matches = db.Matches.ToList().Where(x => x.WeekId.Equals(week) && x.SeasonId.Equals(seasonId));
            var weekMatches = Mapper.Map<IEnumerable<MatchViewModel>>(matches);
            return Request.CreateResponse(matches);
        }
        [HttpGet]
        public HttpResponseMessage GetMatchesBySeason(int seasonId)
        {
            var matches = db.Matches.ToList().Where(x => x.SeasonId.Equals(seasonId)).OrderBy(y => y.Date);
            var matchesModel = Mapper.Map<IEnumerable<MatchViewModel>>(matches);

            return Request.CreateResponse(matchesModel);
        }
        [HttpGet]
        public HttpResponseMessage GetGoalsBySeason(int seasonId)
        {
            var goals = db.Goals.ToList().Where(x => x.SeasonId.Equals(seasonId)).OrderBy(y => y.Match.Date);
            var goalModel = Mapper.Map<IEnumerable<GoalViewModel>>(goals);

            return Request.CreateResponse(goalModel);
        }
        public HttpResponseMessage PostPlayer(PlayerRegistrationModel player)
        {


            if (ModelState.IsValid)
            {
                var teamCode = db.TeamCodes.FirstOrDefault(x => x.TeamId.Equals(player.TeamId));
                if (teamCode.Code.Equals(player.TeamCode))
                {
                    var realPlayer = Mapper.Map<Player>(player);
                    db.Players.Add(realPlayer);
                    db.SaveChanges();
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, player);
                    response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = player.Id }));
                }
                else
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.BadRequest, "NoCode");
                    response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = player.Id }));
                    return response;
                }
                return Request.CreateResponse(HttpStatusCode.Created, player);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }
        [HttpGet]
        public HttpResponseMessage GetWeeksBySeason(int seasonId)
        {
            var weeks = db.Weeks.ToList().Where(x => x.SeasonId.Equals(seasonId));
            var weeksModel = Mapper.Map<IEnumerable<WeekViewModel>>(weeks);

            return Request.CreateResponse(weeksModel);
        }

        [HttpGet]
        public HttpResponseMessage GetPositions()
        {
            var positions = db.Positions.ToList();
            var positionsModel = Mapper.Map<IEnumerable<PositionViewModel>>(positions);

            return Request.CreateResponse(positionsModel);
        }

        [HttpGet]
        public HttpResponseMessage GetTeamsBySeason(int seasonId)
        {
            var teams = db.Seasons.FirstOrDefault(x => x.Id.Equals(seasonId)).Teams;
            var teamsModel = Mapper.Map<IEnumerable<TeamViewModel>>(teams);

            return Request.CreateResponse(teamsModel);
        }

        [HttpGet]
        public HttpResponseMessage GetMatchesByTeam(int teamid, int seasonId)
        {
            var matches = db.Matches.ToList().Where(x => (x.HomeId.Equals(teamid) && x.SeasonId.Equals(seasonId)) || (x.AwayId.Equals(teamid) && x.SeasonId.Equals(seasonId)));


            return Request.CreateResponse(matches);
        }
        public HttpResponseMessage AddTeamCode([FromBody] TeamCode teamCode)
        {
            if (ModelState.IsValid)
            {
                db.TeamCodes.Add(teamCode);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, teamCode);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = teamCode.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }
        public HttpResponseMessage AddTeamToSeason([FromBody] SeasonTeam seasonTeam)
        {
            var season = db.Seasons.FirstOrDefault(x => x.Id.Equals(seasonTeam.SeasonId));
            var team = db.Teams.FirstOrDefault(x => x.Id.Equals(seasonTeam.TeamId));
            //TODO validate both.
            season.Teams.Add(team);
            db.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK);
        }
        public HttpResponseMessage AddPlayerToSeason([FromBody] SeasonPlayer seasonPlayer)
        {
            var season = db.Seasons.FirstOrDefault(x => x.Id.Equals(seasonPlayer.SeasonId));
            var player = db.Players.FirstOrDefault(x => x.Id.Equals(seasonPlayer.PlayerId));
            //TODO validate both.
            if (player != null)
            {
                player.Seasons.Add(season);
                db.SaveChanges();
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        public IEnumerable<TeamRanking> GetStandings(int id)
        {
            var teamRanking = new List<TeamRanking>();

            var allTeams = db.Teams.ToList();
            var teams = new List<Team>();
            foreach (var team in allTeams)
            {
                foreach (var season in team.Seasons)
                {
                    if (season.Id.Equals(id))
                    {
                        teams.Add(team);
                    }
                }
            }
            var weeks = db.Weeks.Where(x => x.SeasonId.Equals(id)).ToList();

            foreach (var team in teams)
            {
                var recentMatchForm = new List<MatchFormModel>();
                var tamRank = new TeamRanking(team.Id, team.Name);
                foreach (var week in weeks)
                {

                    var matches = db.Matches.OrderBy(x => x.Date).Where(x => x.WeekId.Equals(week.Id)).ToList();
                    if (matches == null)
                        continue;
                    foreach (var match in matches)
                    {
                        if (match.Played == false)
                            continue;

                        if (team.Id.Equals(match.HomeId))
                        {
                            var matchForm = Mapper.Map<MatchFormModel>(match);
                            matchForm.GoalsFor = match.HomeGoals;
                            matchForm.GoalsAgainst = match.AwayGoals;
                            tamRank.Games++;
                            tamRank.GoalsFor += match.HomeGoals;
                            tamRank.GoalsAgainst += match.AwayGoals;
                            tamRank.GoalsDifference += (match.HomeGoals - match.AwayGoals);
                            if (match.HomeGoals > match.AwayGoals)
                            {
                                matchForm.ResultClass = "win";
                                matchForm.Result = "נצחון";
                                tamRank.Wins++;
                                tamRank.Points += 3;
                            }
                            else if (match.HomeGoals == match.AwayGoals)
                            {
                                matchForm.ResultClass = "draw";
                                matchForm.Result = "תיקו";
                                tamRank.Draws++;
                                tamRank.Points += 1;
                            }
                            else if (match.HomeGoals < match.AwayGoals)
                            {
                                matchForm.ResultClass = "loss";
                                matchForm.Result = "הפסד";
                                tamRank.Losses++;

                            }
                            recentMatchForm.Add(matchForm);
                        }
                        else if (team.Id.Equals(match.AwayId))
                        {
                            var matchForm = Mapper.Map<MatchFormModel>(match);
                            matchForm.GoalsFor = match.AwayGoals;
                            matchForm.GoalsAgainst = match.HomeGoals;
                            tamRank.Games++;
                            tamRank.GoalsFor += match.AwayGoals;
                            tamRank.GoalsAgainst += match.HomeGoals;
                            tamRank.GoalsDifference += (match.AwayGoals - match.HomeGoals);
                            if (match.HomeGoals < match.AwayGoals)
                            {
                                matchForm.ResultClass = "win";
                                matchForm.Result = "נצחון";
                                tamRank.Wins++;
                                tamRank.Points += 3;
                            }
                            else if (match.HomeGoals == match.AwayGoals)
                            {
                                matchForm.ResultClass = "draw";
                                matchForm.Result = "תיקו";
                                tamRank.Draws++;
                                tamRank.Points += 1;
                            }
                            else if (match.HomeGoals > match.AwayGoals)
                            {
                                matchForm.ResultClass = "loss";
                                matchForm.Result = "הפסד";
                                tamRank.Losses++;
                            }
                            recentMatchForm.Add(matchForm);

                        }

                    }////matches
                }////////////weeks
                tamRank.MatchForm = recentMatchForm;
                teamRanking.Add(tamRank);
            }///////teams
            teamRanking = teamRanking.OrderByDescending(x => x.Points).ToList();
            var position = 1;
            foreach (var team in teamRanking)
            {
                team.Position = position++;
            }
            return teamRanking;
        }
        // GET api/Match/5
        public Match GetMatch(int id)
        {
            Match match = db.Matches.Find(id);
            if (match == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return match;
        }

        public IEnumerable<PlayerViewModel> GetTeamPlayers(int teamId)
        {
            var teamPlayers = db.Players.Where(x => x.TeamId == teamId);
            var teamPlayersModel = Mapper.Map<IEnumerable<PlayerViewModel>>(teamPlayers);
            return teamPlayersModel;
        }
        [HttpPost]
        public IEnumerable<PlayerViewModel> GetTeamSeasonPlayers([FromBody]SeasonTeam seasonTeam)
        {
            var players = db.Players.Where(x => x.TeamId == seasonTeam.TeamId).ToList();
            var players2 = players.Where(x => x.Seasons.Any(y => y.Id == seasonTeam.SeasonId));
            var goals = db.Goals.Where(x => x.Player.TeamId == seasonTeam.TeamId && x.SeasonId == seasonTeam.SeasonId);
            foreach (var player in players2)
            {
                foreach (var goal in goals)
                {
                    if ((player.Id).Equals(goal.PlayerId))
                        player.Goals++;
                }
            }
            //var players = db.Seasons.Where(s=>s.Id==seasonTeam.SeasonId).Select(x => x.Players.Where(y => y.TeamId == seasonTeam.TeamId)).ToList();
            var playersModel = Mapper.Map<IEnumerable<PlayerViewModel>>(players2);

            return playersModel;
        }
        public IEnumerable<PlayerViewModel> GetSeasonPlayers(int season)
        {
            var players = db.Players.ToList();
            var playersModel = new List<PlayerViewModel>();
            foreach (var player in players)
            {
                foreach (var playesSeason in player.Team.Seasons)
                {
                    if (playesSeason.Id.Equals(season))
                    {
                        playersModel.Add(Mapper.Map<PlayerViewModel>(player));
                    }
                }
            }
            return playersModel;
        }
        public IEnumerable<TeamViewModel> GetSeasonTeams(int season)
        {
            if(season==0)
            {
                season = db.Seasons.OrderByDescending(x => x.Priority).First().Id;
            }
            var teams = db.Seasons.FirstOrDefault(x => x.Id==season).Teams;
            var teamssModel = Mapper.Map<IEnumerable<TeamViewModel>>(teams);

            return teamssModel;
        }
        public IEnumerable<PlayerViewModel> GetScorers(int season)
        {
            var goals = db.Goals.Where(x => x.SeasonId.Equals(season)).ToList();
            var players = db.Players.ToList();
            var plsyerList = new List<Player>()
            {

            };
            var playersModel = Mapper.Map<IEnumerable<PlayerViewModel>>(players);



            foreach (var player in playersModel)
            {
                //player.Team.Seasons = null;
                foreach (var goal in goals)
                {
                    if ((player.Id).Equals(goal.PlayerId))
                    {
                        player.Goals += 1;
                    }
                }
            }
            playersModel = playersModel.OrderByDescending(x => x.Goals).Take(10).ToList();

            return playersModel;
        }
        [HttpPost]
        public HttpResponseMessage NextWeek([FromBody]Season season)
        {
            var nextWeek = season.NextWeek;
            var currentSeason = db.Seasons.Find(season.Id);
            season = currentSeason;
            season.NextWeek = nextWeek;
            db.Entry(currentSeason).CurrentValues.SetValues(season);
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }
        [HttpPost]
        public HttpResponseMessage UpdateWeek([FromBody]IEnumerable<Match> matches)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            foreach (var match in matches)
            {
                var currentMatch = db.Matches.Find(match.Id);
                //currentMatch.Goals = db.Goals.Where(x => x.MatchId.Equals(currentMatch.Id));
                db.Entry(currentMatch).CurrentValues.SetValues(match);
                //db.Entry(match).State = EntityState.Modified;

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        //[HttpPost]
        //public HttpResponseMessage EditAWeek([FromBody]IEnumerable<Match> matches)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        //    }
        //    foreach (var match in matches)
        //    {
        //        match.Home = db.Teams.Where(x => x.Id.Equals(match.HomeId)).FirstOrDefault();
        //        match.Away = db.Teams.Where(x => x.Id.Equals(match.AwayId)).FirstOrDefault();
        //        var currentMatch = db.Matches.Find(match.Id);
        //        if (currentMatch == null)
        //        {

        //            AddMatch(match);
        //        }
        //        else
        //        {
        //            currentMatch.Home = db.Teams.Where(x => x.Id.Equals(match.HomeId)).FirstOrDefault();
        //            currentMatch.Away = db.Teams.Where(x => x.Id.Equals(match.AwayId)).FirstOrDefault();
        //            db.Entry(currentMatch).CurrentValues.SetValues(match);
        //            try
        //            {
        //                db.SaveChanges();
        //            }
        //            catch (DbUpdateConcurrencyException ex)
        //            {
        //                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
        //            }
        //        }

        //        //db.Entry(match).State = EntityState.Modified;


        //    }
        //    return Request.CreateResponse(HttpStatusCode.OK);
        //}
        [HttpGet]
        public Match GetEmptyMatch()
        {
            var match = new Match();
            return match;
        }
        [HttpGet]
        public IEnumerable<Player> GetMatchPlayers(int id)
        {
            var match = db.Matches.Where(x => x.Id.Equals(id)).FirstOrDefault();
            var players = db.Players.Where(x => x.TeamId.Equals(match.HomeId) || x.TeamId.Equals(match.AwayId));
            return players;
        }

        [HttpPost]
        public HttpResponseMessage EditWeekTeams([FromBody]IEnumerable<Match> matches)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            var weekId = matches.FirstOrDefault().WeekId;
            var seasonId = matches.FirstOrDefault().SeasonId;
            foreach (var match in matches)
            {
                match.Home = db.Teams.Where(x => x.Id.Equals(match.HomeId)).FirstOrDefault();
                match.Away = db.Teams.Where(x => x.Id.Equals(match.AwayId)).FirstOrDefault();
                match.WeekId = weekId;
                match.Week = db.Weeks.Where(x => x.Id.Equals(weekId)).FirstOrDefault();
                match.Season = db.Seasons.FirstOrDefault(x => x.Id.Equals(seasonId));
                match.SeasonId = match.Season.Id;
                var currentMatch = db.Matches.Find(match.Id);
                if (currentMatch == null && (match.Home != null && match.Away != null))
                {
                    AddMatch(match);
                }
                else
                {
                    currentMatch.Home = db.Teams.Where(x => x.Id.Equals(match.HomeId)).FirstOrDefault();
                    currentMatch.Away = db.Teams.Where(x => x.Id.Equals(match.AwayId)).FirstOrDefault();
                    db.Entry(currentMatch).CurrentValues.SetValues(match);
                    try
                    {
                        db.SaveChanges();
                    }
                    catch (DbUpdateConcurrencyException ex)
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
                    }
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        private void AddMatch(Match match)
        {
            db.Matches.Add(match);
            db.SaveChanges();
        }


        // PUT api/Match/5
        public HttpResponseMessage PutMatch(int id, Match match)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != match.Id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(match).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/Match
        public HttpResponseMessage PostMatch(Match match)
        {
            if (ModelState.IsValid)
            {
                db.Matches.Add(match);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, match);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = match.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Match/5
        public HttpResponseMessage DeleteMatch(int id)
        {
            Match match = db.Matches.Find(id);
            if (match == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Matches.Remove(match);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, match);
        }
        [HttpPost]
        public HttpResponseMessage DeleteTeamFromSeason([FromBody]SeasonTeam seasonTeam)
        {
            var season = db.Seasons.FirstOrDefault(x => x.Id.Equals(seasonTeam.SeasonId));
            var team = db.Teams.FirstOrDefault(x => x.Id.Equals(seasonTeam.TeamId));
            if (season != null) season.Teams.Remove(team);
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }
        [HttpPost]
        public HttpResponseMessage DeletePlayerFromSeason([FromBody]SeasonPlayer seasonPlayer)
        {
            var season = db.Seasons.FirstOrDefault(x => x.Id.Equals(seasonPlayer.SeasonId));
            var player = db.Players.FirstOrDefault(x => x.Id.Equals(seasonPlayer.PlayerId));
            if (player != null) player.Seasons.Remove(season);
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}