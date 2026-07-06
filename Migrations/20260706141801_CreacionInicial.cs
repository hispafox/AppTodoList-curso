using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppTodoList.Migrations
{
    /// <inheritdoc />
    public partial class CreacionInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlantillasTarea",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Titulo = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    EsRepetitiva = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    Recurrencia = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlantillasTarea", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TodoItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    IsCompleted = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')"),
                    EsRepetitiva = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    Recurrencia = table.Column<int>(type: "INTEGER", nullable: true),
                    ProximaFecha = table.Column<DateTime>(type: "TEXT", nullable: true),
                    PlantillaId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodoItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TodoItems_PlantillasTarea_PlantillaId",
                        column: x => x.PlantillaId,
                        principalTable: "PlantillasTarea",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TodoItems_PlantillaId",
                table: "TodoItems",
                column: "PlantillaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TodoItems");

            migrationBuilder.DropTable(
                name: "PlantillasTarea");
        }
    }
}
