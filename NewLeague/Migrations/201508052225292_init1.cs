namespace NewLeague.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Matches",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Season = c.Int(nullable: false),
                        Week = c.Int(nullable: false),
                        HomeId = c.Int(nullable: false),
                        AwayId = c.Int(nullable: false),
                        HomeGoals = c.Int(nullable: false),
                        AwayGoals = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddForeignKey("dbo.Goals", "PlayerId", "dbo.Players", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Goals", "MatchId", "dbo.Matches", "Id", cascadeDelete: true);
            CreateIndex("dbo.Goals", "PlayerId");
            CreateIndex("dbo.Goals", "MatchId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Goals", new[] { "MatchId" });
            DropIndex("dbo.Goals", new[] { "PlayerId" });
            DropForeignKey("dbo.Goals", "MatchId", "dbo.Matches");
            DropForeignKey("dbo.Goals", "PlayerId", "dbo.Players");
            DropTable("dbo.Matches");
        }
    }
}
