namespace NewLeague.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class teamtouser2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.UserInfoes", "TeamId", "dbo.Teams");
            DropIndex("dbo.UserInfoes", new[] { "TeamId" });
            DropTable("dbo.UserInfoes");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.UserInfoes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TeamId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateIndex("dbo.UserInfoes", "TeamId");
            AddForeignKey("dbo.UserInfoes", "TeamId", "dbo.Teams", "Id", cascadeDelete: true);
        }
    }
}
