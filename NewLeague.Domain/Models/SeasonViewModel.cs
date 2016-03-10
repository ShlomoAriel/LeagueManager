using NewLeague.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewLeague.Domain.Models
{
    public class SeasonViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int NextWeek { get; set; }
        //public ICollection<TeamViewModel> Teams { get; set; }
        public int Priority { get; set; }
        public bool HasTable { get; set; }
    }
}