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
using AutoMapper;
using NewLeague.Domain.Models;

namespace NewLeague.Domain.Controllers
{
    public class TeamController : ApiController
    {
        private DomainContext db = new DomainContext();

        // GET api/Team
        public IEnumerable<TeamViewModel> GetTeams()
        {
            var teams = db.Teams.ToList();
            var teamsModel = Mapper.Map<List<TeamViewModel>>(teams);
            return teamsModel;
        }
        // GET api/Team/5
        public TeamRanking GetTeam(int id)
        {
            Team team = db.Teams.Find(id);
            if (team == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var currentSeason = db.Seasons.OrderByDescending(x => x.Priority).FirstOrDefault();
            //var goals = db.Goals.Select(x => x.Player.TeamId.Equals(teamsModel.Id) && x.SeasonId.Equals(currentSeason.Id));


            var weeks = db.Weeks.Where(x => x.SeasonId.Equals(currentSeason.Id)).ToList();
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
            }
            tamRank.MatchForm = recentMatchForm;
            return tamRank;
        }

        // PUT api/Team/5
        [HttpPut]
        public HttpResponseMessage PutTeam([FromBody]Team team)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            var oldTeam = db.Teams.FirstOrDefault(x => x.Id == team.Id);
            if (oldTeam != null) oldTeam.Name = team.Name;
            db.Entry(oldTeam).State = EntityState.Modified;

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

        // POST api/Team
        public HttpResponseMessage PostTeam(Team team)
        {
            if (ModelState.IsValid)
            {
                db.Teams.Add(team);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, team);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = team.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Team/5
        public HttpResponseMessage DeleteTeam(int id)
        {
            Team team = db.Teams.Find(id);
            if (team == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Teams.Remove(team);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, team);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}