using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewLeague.Models
{
    public class GoalViewModel
    {
        public int Id { get; set; }

        public int PlayerId { get; set; }
        public virtual PlayerViewModel Player { get; set; }
        //public int TeamIdId { get; set; }

        public int MatchId { get; set; }
        public virtual MatchViewModel Match { get; set; }

        public int SeasonId { get; set; }
    }
}