using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rednest.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceIsVerificatedWithVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Verification",
                table: "UserSessions",
                type: "jsonb",
                nullable: false,
                defaultValueSql: "'\"NotVerificated\"'::jsonb");

            migrationBuilder.Sql(@"
                UPDATE ""UserSessions""
                SET ""Verification"" = '""Comfirmed""'::jsonb
                WHERE ""UserId"" IN (
                    SELECT ""Id"" FROM ""Users"" WHERE ""Role"" = 'Bot' OR ""Role"" = 'AI'
                );
            ");

            migrationBuilder.DropColumn(
                name: "IsVerificated",
                table: "UserSessions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVerificated",
                table: "UserSessions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql(@"
                UPDATE ""UserSessions""
                SET ""IsVerificated"" = TRUE
                WHERE ""Verification"" = '""Comfirmed""'::jsonb;
            ");

            migrationBuilder.DropColumn(
                name: "Verification",
                table: "UserSessions");
        }
    }
}
