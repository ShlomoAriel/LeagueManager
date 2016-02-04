using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewLeague.Models
{
    public class Goal
    {
        public int Id { get; set; }

        public int PlayerId { get; set; }
        public virtual Player Player { get; set; }
        //public int TeamIdId { get; set; }

        public int MatchId { get; set; }
        public virtual Match Match { get; set; }

        public int SeasonId { get; set; }
    }
}