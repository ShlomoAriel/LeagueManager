using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewLeague.Domain.Models
{
    public class TeamCode
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string Code { get; set; }
    }
}