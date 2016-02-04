namespace NewLeague.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class weekname : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Weeks", "Number", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Weeks", "Number", c => c.Int(nullable: false));
        }
    }
}
