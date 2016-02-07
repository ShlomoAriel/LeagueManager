using NewLeague.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewLeague.Domain.Models
{
    public class Season
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Team> Teams { get; set; }
        public virtual ICollection<Player> Players { get; set; }
        public int NextWeek { get; set; }
        public int Priority { get; set; }
        public bool HasTable { get; set; }
    }
}