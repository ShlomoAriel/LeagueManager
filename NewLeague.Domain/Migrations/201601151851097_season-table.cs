namespace NewLeague.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class seasontable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Seasons", "HasTable", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Seasons", "HasTable");
        }
    }
}
