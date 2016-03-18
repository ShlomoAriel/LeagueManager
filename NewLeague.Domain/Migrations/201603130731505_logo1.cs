namespace NewLeague.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class logo1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Logoes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TeamId = c.Int(nullable: false),
                        FileName = c.String(maxLength: 255),
                        Description = c.String(),
                        ContentType = c.String(maxLength: 100),
                        Content = c.Binary(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Teams", t => t.TeamId, cascadeDelete: true)
                .Index(t => t.TeamId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Logoes", "TeamId", "dbo.Teams");
            DropIndex("dbo.Logoes", new[] { "TeamId" });
            DropTable("dbo.Logoes");
        }
    }
}
