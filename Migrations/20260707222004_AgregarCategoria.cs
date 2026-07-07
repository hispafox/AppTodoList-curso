using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppTodoList.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCategoria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoriaId",
                table: "TodoItems",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Color = table.Column<string>(type: "TEXT", maxLength: 7, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TodoItems_CategoriaId",
                table: "TodoItems",
                column: "CategoriaId");

            migrationBuilder.AddForeignKey(
                name: "FK_TodoItems_Categorias_CategoriaId",
                table: "TodoItems",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TodoItems_Categorias_CategoriaId",
                table: "TodoItems");

            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropIndex(
                name: "IX_TodoItems_CategoriaId",
                table: "TodoItems");

            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "TodoItems");
        }
    }
}
