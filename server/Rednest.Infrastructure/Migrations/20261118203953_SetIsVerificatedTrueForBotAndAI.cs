using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rednest.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SetIsVerificatedTrueForBotAndAI : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""UserSessions""
                SET ""IsVerificated"" = TRUE
                WHERE ""UserId"" IN (
                    SELECT ""Id"" FROM ""Users"" WHERE ""Role"" = 'Bot' OR ""Role"" = 'AI'
                );

                INSERT INTO ""UserSessions"" (""UserId"", ""IsActive"", ""IsVerificated"", ""2FA"", ""Subscribe"", ""AccountVerify"", ""Sessions"")
                SELECT ""Id"", TRUE, TRUE, FALSE, FALSE, '[]'::jsonb, '[]'::jsonb
                FROM ""Users""
                WHERE (""Role"" = 'Bot' OR ""Role"" = 'AI')
                  AND ""Id"" NOT IN (SELECT ""UserId"" FROM ""UserSessions"");
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""UserSessions""
                SET ""IsVerificated"" = FALSE
                WHERE ""UserId"" IN (
                    SELECT ""Id"" FROM ""Users"" WHERE ""Role"" = 'Bot' OR ""Role"" = 'AI'
                );
            ");
        }
    }
}
