using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NewLeague.Domain.Models;

namespace NewLeague.Models
{
    public class PlayerViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TeamId { get; set; }
        public virtual TeamViewModel Team { get; set; }
        public int Goals { get; set; }
        public int PositionId { get; set; }
        public virtual PositionViewModel Position { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public virtual ICollection<SeasonViewModel> Seasons { get; set; }
    }
}