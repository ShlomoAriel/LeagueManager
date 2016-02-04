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
        public Player Player { get; set; }
        //public int TeamIdId { get; set; }

        public int MatchId { get; set; }
        public Match Match { get; set; }
    }
}