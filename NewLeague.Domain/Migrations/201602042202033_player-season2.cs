namespace NewLeague.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class playerseason2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Seasons", "Player_Id", "dbo.Players");
            DropIndex("dbo.Seasons", new[] { "Player_Id" });
            CreateTable(
                "dbo.PlayerSeasons",
                c => new
                    {
                        Player_Id = c.Int(nullable: false),
                        Season_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Player_Id, t.Season_Id })
                .ForeignKey("dbo.Players", t => t.Player_Id, cascadeDelete: true)
                .ForeignKey("dbo.Seasons", t => t.Season_Id, cascadeDelete: true)
                .Index(t => t.Player_Id)
                .Index(t => t.Season_Id);
            
            DropColumn("dbo.Seasons", "Player_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Seasons", "Player_Id", c => c.Int());
            DropForeignKey("dbo.PlayerSeasons", "Season_Id", "dbo.Seasons");
            DropForeignKey("dbo.PlayerSeasons", "Player_Id", "dbo.Players");
            DropIndex("dbo.PlayerSeasons", new[] { "Season_Id" });
            DropIndex("dbo.PlayerSeasons", new[] { "Player_Id" });
            DropTable("dbo.PlayerSeasons");
            CreateIndex("dbo.Seasons", "Player_Id");
            AddForeignKey("dbo.Seasons", "Player_Id", "dbo.Players", "Id");
        }
    }
}
