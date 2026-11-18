using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rednest.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsVerificatedToUserSessions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVerificated",
                table: "UserSessions",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVerificated",
                table: "UserSessions");
        }
    }
}
