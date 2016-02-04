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
using EntityState = System.Data.Entity.EntityState;

namespace NewLeague.Domain.Controllers
{
    public class WeeksController : ApiController
    {
        private DomainContext db = new DomainContext();

        // GET: api/Weeks
        public IQueryable<Week> GetWeeks()
        {
            return db.Weeks;
        }

        // GET: api/Weeks/5
        [ResponseType(typeof(Week))]
        public IHttpActionResult GetWeek(int id)
        {
            Week week = db.Weeks.Find(id);
            if (week == null)
            {
                return NotFound();
            }

            return Ok(week);
        }

        // PUT: api/Weeks/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutWeek(int id, Week week)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != week.Id)
            {
                return BadRequest();
            }

            db.Entry(week).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WeekExists(id))
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

        // POST: api/Weeks
        [ResponseType(typeof(Week))]
        public IHttpActionResult PostWeek(Week week)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Weeks.Add(week);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = week.Id }, week);
        }

        // DELETE: api/Weeks/5
        [ResponseType(typeof(Week))]
        public IHttpActionResult DeleteWeek(int id)
        {
            Week week = db.Weeks.Find(id);
            if (week == null)
            {
                return NotFound();
            }

            db.Weeks.Remove(week);
            db.SaveChanges();

            return Ok(week);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool WeekExists(int id)
        {
            return db.Weeks.Count(e => e.Id == id) > 0;
        }
    }
}