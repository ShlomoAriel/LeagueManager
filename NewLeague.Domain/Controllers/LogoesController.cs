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

namespace NewLeague.Domain.Controllers
{
    public class LogoesController : ApiController
    {
        //private DomainContext db = new DomainContext();

        //// GET: api/Logoes
        //public IQueryable<Logo> GetLogos()
        //{
        //    return db.Logos;
        //}

        //// GET: api/Logoes/5
        //[ResponseType(typeof(Logo))]
        //public IHttpActionResult GetLogo(int id)
        //{
        //    Logo logo = db.Logos.Find(id);
        //    if (logo == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(logo);
        //}

        //// PUT: api/Logoes/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutLogo(int id, Logo logo)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != logo.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(logo).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!LogoExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        //// POST: api/Logoes
        //[ResponseType(typeof(Logo))]
        //public IHttpActionResult PostLogo(Logo logo)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Logos.Add(logo);
        //    db.SaveChanges();

        //    return CreatedAtRoute("DefaultApi", new { id = logo.Id }, logo);
        //}

        //// DELETE: api/Logoes/5
        //[ResponseType(typeof(Logo))]
        //public IHttpActionResult DeleteLogo(int id)
        //{
        //    Logo logo = db.Logos.Find(id);
        //    if (logo == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Logos.Remove(logo);
        //    db.SaveChanges();

        //    return Ok(logo);
        //}

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        db.Dispose();
        //    }
        //    base.Dispose(disposing);
        //}

        //private bool LogoExists(int id)
        //{
        //    return db.Logos.Count(e => e.Id == id) > 0;
        //}
    }
}