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
using System.Web.Http.Cors;
namespace NewLeague.Controllers
{
    [EnableCors(origins: "http://localhost:58696/", headers: "*", methods: "*")]
    public class PlayerController : ApiController
    {
        private NewLeagueContext db = new NewLeagueContext();

        // GET api/Player
        public IEnumerable<Player> GetPlayers()
        {
            return db.Players.AsEnumerable();
        }

        // GET api/Player/5
        public Player GetPlayer(int id)
        {
            Player player = db.Players.Find(id);
            if (player == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return player;
        }

        // PUT api/Player/5
        public HttpResponseMessage PutPlayer(int id, Player player)
        {
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