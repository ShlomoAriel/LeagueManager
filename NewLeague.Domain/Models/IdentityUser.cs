using Microsoft.AspNet.Identity.EntityFramework;
using NewLeague.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace NewLeague.Domain.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual Team Team { get; set; }
        [ForeignKey("Team")]
        public int? TeamId { get; set; }
    }

}