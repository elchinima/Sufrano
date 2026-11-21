using Microsoft.EntityFrameworkCore.Migrations;
using Sufrano.Core.Entities;

#nullable disable

namespace Sufrano.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNotesToOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<OrderNotes>(
                name: "Notes",
                table: "Orders",
                type: "jsonb",
                nullable: false,
                defaultValueSql: "'{}'::jsonb");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Orders");
        }
    }
}
