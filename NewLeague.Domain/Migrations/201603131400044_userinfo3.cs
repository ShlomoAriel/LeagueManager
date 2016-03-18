namespace NewLeague.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class userinfo3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Logoes", "TeamId", "dbo.Teams");
            DropIndex("dbo.Logoes", new[] { "TeamId" });
            DropTable("dbo.Logoes");
        }
        
        public override void Down()
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
                .PrimaryKey(t => t.Id);
            
            CreateIndex("dbo.Logoes", "TeamId");
            AddForeignKey("dbo.Logoes", "TeamId", "dbo.Teams", "Id", cascadeDelete: true);
        }
    }
}
