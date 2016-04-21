namespace NewLeague.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class timestring : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Matches", "Time", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Matches", "Time");
        }
    }
}
