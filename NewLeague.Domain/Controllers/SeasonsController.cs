using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using NewLeague.Domain.Models;
using NewLeague.Domain.Models.NewLeague;
using AutoMapper;
using Microsoft.AspNet.Identity;
using EntityState = System.Data.Entity.EntityState;
using System.Security.Claims;

namespace NewLeague.Domain.Controllers
{
    public class SeasonsController : ApiController
    {
        private DomainContext db = new DomainContext();

        // GET: api/Seasons
        public IEnumerable<SeasonViewModel> GetSeasons()
        {
            var seasons = db.Seasons.OrderByDescending(x => x.Priority).ToList();
            var seasonsModel = new List<SeasonViewModel>();
            seasonsModel = Mapper.Map<List<SeasonViewModel>>(seasons);

            return seasonsModel;
        }

        // GET: api/Seasons/5
        [ResponseType(typeof(Season))]
        public IHttpActionResult GetSeason(int id)
        {
            Season season = db.Seasons.Find(id);
            if (season == null)
            {
                return NotFound();
            }

            var SeasonModel = Mapper.Map<SeasonViewModel>(season);

            return Ok(SeasonModel);
        }

        // PUT: api/Seasons/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSeason(int id, Season season)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != season.Id)
            {
                return BadRequest();
            }

            db.Entry(season).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeasonExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Seasons
        [ResponseType(typeof(Season))]
        public IHttpActionResult PostSeason(Season season)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Seasons.Add(season);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = season.Id }, season);
        }

        // DELETE: api/Seasons/5
        [ResponseType(typeof(Season))]
        public IHttpActionResult DeleteSeason(int id)
        {
            Season season = db.Seasons.Find(id);
            if (season == null)
            {
                return NotFound();
            }

            db.Seasons.Remove(season);
            db.SaveChanges();

            return Ok(season);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SeasonExists(int id)
        {
            return db.Seasons.Count(e => e.Id == id) > 0;
        }
    }
}