using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NewLeague.Models;

namespace NewLeague.Domain.Models
{
    public class Week
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public int SeasonId { get; set; }
        public virtual Season Season { get; set; }
        public IEnumerable<Match> Matches { get; set; }
    }
}