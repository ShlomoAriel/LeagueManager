using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using NewLeague.Domain.Models;

namespace NewLeague.Models
{
    public class MatchFormModel
    {
        //public int Id { get; set; }
        //public int SeasonId { get; set; }
        //public int WeekId { get; set; }
        //public virtual TeamViewModel Home { get; set; }
        //public virtual TeamViewModel Away { get; set; }
        //public virtual WeekViewModel Week { get; set; }
        //public int HomeId { get; set; }
        //public int AwayId { get; set; }
        //public IEnumerable<GoalViewModel> Goals { get; set; }
        //public bool Played { get; set; }
        //public DateTime? Date { get; set; }
        public int GoalsFor { get; set; }
        public int GoalsAgainst { get; set; }
        public string Result { get; set; }
        public string ResultClass { get; set; }
    }
}