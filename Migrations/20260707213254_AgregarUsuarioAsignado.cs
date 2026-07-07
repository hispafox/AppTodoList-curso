using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppTodoList.Migrations
{
    /// <inheritdoc />
    public partial class AgregarUsuarioAsignado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UsuarioAsignadoId",
                table: "TodoItems",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UsuariosAsignados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsuariosAsignados", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TodoItems_UsuarioAsignadoId",
                table: "TodoItems",
                column: "UsuarioAsignadoId");

            migrationBuilder.CreateIndex(
                name: "IX_UsuariosAsignados_Email",
                table: "UsuariosAsignados",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TodoItems_UsuariosAsignados_UsuarioAsignadoId",
                table: "TodoItems",
                column: "UsuarioAsignadoId",
                principalTable: "UsuariosAsignados",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TodoItems_UsuariosAsignados_UsuarioAsignadoId",
                table: "TodoItems");

            migrationBuilder.DropTable(
                name: "UsuariosAsignados");

            migrationBuilder.DropIndex(
                name: "IX_TodoItems_UsuarioAsignadoId",
                table: "TodoItems");

            migrationBuilder.DropColumn(
                name: "UsuarioAsignadoId",
                table: "TodoItems");
        }
    }
}
