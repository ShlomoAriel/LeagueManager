using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewLeague.Models
{
    public class TeamRanking
    {
        public int Id { get; set; }
        public int Position { get; set; }
        public string Name { get; set; }
        public int GoalsFor { get; set; }
        public int GoalsAgainst { get; set; }
        public int GoalsDifference { get; set; }
        public int Points { get; set; }
        public int Games { get; set; }
        public int Wins { get; set; }
        public int Draws { get; set; }
        public int Losses { get; set; }
        public IEnumerable<MatchFormModel> MatchForm { get; set; }
        public TeamRanking()
        {
            GoalsAgainst = 0;
            GoalsFor=0;
            Wins=0;
            Losses=0;
            Draws=0;
            Points=0;
        }
        public TeamRanking(int id,string name)
        {
            this.Id = id;
            this.Name = name;
            this.GoalsAgainst = 0;
            this.GoalsFor = 0;
            this.Wins = 0;
            this.Games = 0;
            this.Losses = 0;
            this.Draws = 0;
            this.Points = 0;
            this.GoalsDifference = 0;

        }
    }
    
}