using NewLeague.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewLeague.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TeamId { get; set; }
        public virtual Team Team { get; set; }
        public int PositionId { get; set; }
        public virtual Position Position { get; set; }
        public int Goals { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public virtual ICollection<Season> Seasons { get; set; }
        
    }
}