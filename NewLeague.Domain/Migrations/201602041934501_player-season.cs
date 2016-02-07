namespace NewLeague.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class playerseason : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Seasons", "Player_Id", c => c.Int());
            CreateIndex("dbo.Seasons", "Player_Id");
            AddForeignKey("dbo.Seasons", "Player_Id", "dbo.Players", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Seasons", "Player_Id", "dbo.Players");
            DropIndex("dbo.Seasons", new[] { "Player_Id" });
            DropColumn("dbo.Seasons", "Player_Id");
        }
    }
}
