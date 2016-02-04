using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace NewLeague.Models
{
    public class Match
    {
        public int Id { get; set; }
        public int Season { get; set; }
        public int Week { get; set; }
        public int HomeId { get; set; }
        public int AwayId { get; set; }
        public int HomeGoals { get; set; }
        public int AwayGoals { get; set; }
    }
}