using NewLeague.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewLeague.Domain.Models
{
    public class Logo:File
    {
        public int TeamId { get; set; }
        public virtual Team Team { get; set; }
    }
}