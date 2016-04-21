using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using NewLeague.Domain.Models;

namespace NewLeague.Models
{
    public class Match
    {
        public int Id { get; set; }
        public int SeasonId { get; set; }
        public int WeekId { get; set; }
        public virtual Team Home { get; set; }
        public virtual Team Away { get; set; }
        public virtual Season Season { get; set; }
        public virtual Week Week { get; set; }
        public int HomeId { get; set; }
        public int AwayId { get; set; }
        public int HomeGoals { get; set; }
        public int AwayGoals { get; set; }
        public IEnumerable<Goal> Goals { get; set; }
        public bool Played { get; set; }
        public DateTime? Date { get; set; }
        public string Time { get; set; }
    }
}