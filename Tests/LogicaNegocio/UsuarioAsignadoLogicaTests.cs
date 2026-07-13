using AppTodoList.Data;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace AppTodoList.Tests.LogicaNegocio;

public class UsuarioAsignadoLogicaTests
{
    private static AppDbContext CrearContexto(string nombreBaseDatos)
    {
        var opciones = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"{nombreBaseDatos}_{Guid.NewGuid():N}")
            .Options;

        return new AppDbContext(opciones);
    }

    [Fact]
    public async Task ExisteAsync_ConUsuarioExistente_DevuelveTrue()
    {
        // Arrange
        await using var contexto = CrearContexto(nameof(ExisteAsync_ConUsuarioExistente_DevuelveTrue));
        contexto.UsuariosAsignados.Add(new UsuarioAsignado { Id = 1, Nombre = "Ana", Email = "ana@test.com" });
        await contexto.SaveChangesAsync();

        var logica = new UsuarioAsignadoLogica(contexto);

        // Act
        var resultado = await logica.ExisteAsync(1);

        // Assert
        resultado.Should().BeTrue();
    }
}
