using System.Data.Entity;
using NewLeague.Models;

namespace NewLeague.Domain.Models.NewLeague
{
    public class DomainContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, add the following
        // code to the Application_Start method in your Global.asax file.
        // Note: this will destroy and re-create your database with every model change.
        // 
        // System.Data.Entity.Database.SetInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<NewLeague.Domain.Models.NewLeague.DomainContext>());

        public DomainContext() : base("name=DomainContext")
        {
        }

        public DbSet<TeamCode> TeamCodes { get; set; }

        public DbSet<Team> Teams { get; set; }

        public DbSet<Player> Players { get; set; }

        public DbSet<Goal> Goals { get; set; }

        public DbSet<Match> Matches { get; set; }

        public DbSet<Week> Weeks { get; set; }

        public DbSet<Season> Seasons { get; set; }

        public DbSet<Position> Positions { get; set; }

       

    }
}
