using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Sufrano.Core.Entities;

#nullable disable

namespace Sufrano.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvertTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Advert",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    MediaUrl = table.Column<string>(type: "text", nullable: true),
                    Logs = table.Column<AdvertLogs>(type: "jsonb", nullable: false, defaultValueSql: "'{}'::jsonb"),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Likes = table.Column<string>(type: "jsonb", nullable: false, defaultValueSql: "'[]'::jsonb")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Advert", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Advert");
        }
    }
}
