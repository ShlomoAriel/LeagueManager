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
using System.Web.Http.Cors;
using AutoMapper;

namespace NewLeague.Domain.Controllers
{
      [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PlayerController : ApiController
    {
        private DomainContext db = new DomainContext();

        // GET api/Player
        public IEnumerable<PlayerViewModel> GetPlayers()
        {
            var season = db.Seasons.OrderByDescending(x => x.Priority).FirstOrDefault();
            var goals = db.Goals.Where(x=>x.SeasonId.Equals(season.Id)).ToList();
            var players = db.Players.ToList();
            foreach(var player in players)
            {
                foreach(var goal in goals)
                {
                    if ((player.Id).Equals(goal.PlayerId))
                    {
                        player.Goals += 1;
                    }
                }
                
            }
            var playersModel = Mapper.Map<List<PlayerViewModel>>(players);
            return playersModel;
        }

        // GET api/Player/5
        public PlayerViewModel GetPlayer(int id)
        {
            Player player = db.Players.Find(id);
            if (player == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            var goals = db.Goals.ToList();
            var playerModel = Mapper.Map<PlayerViewModel>(player);

            foreach (var goal in goals)
            {
                if ((playerModel.Id).Equals(goal.PlayerId))
                {
                    playerModel.Goals += 1;
                }
            }

            return playerModel;
        }

        // PUT api/Player/5
        public HttpResponseMessage PutPlayer(int id, Player player)
        {
            //if (Request.Headers.AllKeys.Contains("Origin") && Request.HttpMethod == "OPTIONS")
            //{
            //    Response.Flush();
            //}
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != player.Id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(player).State = EntityState.Modified;

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

        // POST api/Player
        public HttpResponseMessage PostPlayer(Player player)
        {
            if (ModelState.IsValid)
            {
                db.Players.Add(player);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, player);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = player.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Player/5
          [HttpDelete]
        public HttpResponseMessage DeletePlayer(int id)
        {
            Player player = db.Players.Find(id);
            if (player == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Players.Remove(player);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, player);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}