using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using NewLeague.Models;
using System.Data.Entity;
using NewLeague.Domain.Models.NewLeague;
using AutoMapper;
using EntityState = System.Data.Entity.EntityState;

namespace NewLeague.Domain.Controllers
{
    public class GoalController : ApiController
    {
        private DomainContext db = new DomainContext();

        // GET api/Goal
        public IEnumerable<GoalViewModel> GetGoals()
        {
            var goals = db.Goals.Include(g => g.Player).Include(g => g.Match);
            var goalsModel = Mapper.Map<List<GoalViewModel>>(goals);
            return goalsModel;
        }

        // GET api/Goal/5
        public GoalViewModel GetGoal(int id)
        {
            Goal goal = db.Goals.Find(id);
            if (goal == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            var goalModel = Mapper.Map<GoalViewModel>(goal);
            return goalModel;
        }

        // PUT api/Goal/5
        public HttpResponseMessage PutGoal(int id, Goal goal)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != goal.Id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(goal).State = EntityState.Modified;

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

        // POST api/Goal
        public GoalViewModel PostGoal(Goal goal)
        {
            if (ModelState.IsValid)
            {
                db.Goals.Add(goal);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, goal);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = goal.Id }));
                var savedGoal = db.Goals.Find(goal.Id);
                //TODO check out virtual properties and when are filled. PLAYER IS NULL.
                var newGoal = Mapper.Map<GoalViewModel>(savedGoal);
                newGoal.Player = Mapper.Map<PlayerViewModel>(db.Players.Find(goal.PlayerId));
                return newGoal;
            }
            return null;
            //else
            //{
            //    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            //}
        }

        // DELETE api/Goal/5
        [HttpDelete]
        public HttpResponseMessage DeleteGoal(int id)
        {
            Goal goal = db.Goals.Find(id);
            if (goal == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Goals.Remove(goal);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, goal);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}