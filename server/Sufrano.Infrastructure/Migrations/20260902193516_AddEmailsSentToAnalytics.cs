using Microsoft.EntityFrameworkCore.Migrations;
using Sufrano.Core.Entities;

#nullable disable

namespace Sufrano.Infrastructure.Migrations
{
    public partial class AddEmailsSentToAnalytics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DailyEmailsSentData>(
                name: "EmailsSent",
                table: "Analytics",
                type: "jsonb",
                nullable: false,
                defaultValueSql: "'{}'::jsonb");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailsSent",
                table: "Analytics");
        }
    }
}
