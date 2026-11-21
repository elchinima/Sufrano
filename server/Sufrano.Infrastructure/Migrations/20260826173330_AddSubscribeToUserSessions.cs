using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sufrano.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSubscribeToUserSessions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Subscribe",
                table: "UserSessions",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subscribe",
                table: "UserSessions");
        }
    }
}
