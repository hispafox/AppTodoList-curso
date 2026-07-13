using AppTodoList.Data;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace AppTodoList.Tests.LogicaNegocio;

public class CategoriaLogicaTests
{
    private static AppDbContext CrearContexto(string nombreBaseDatos)
    {
        var opciones = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"{nombreBaseDatos}_{Guid.NewGuid():N}")
            .Options;

        return new AppDbContext(opciones);
    }

    [Fact]
    public async Task ObtenerTodosAsync_CuandoHayCategorias_DevuelveTodas()
    {
        // Arrange
        await using var contexto = CrearContexto(nameof(ObtenerTodosAsync_CuandoHayCategorias_DevuelveTodas));
        contexto.Categorias.AddRange(
            new Categoria { Id = 1, Nombre = "Trabajo", Color = "#123456" },
            new Categoria { Id = 2, Nombre = "Personal", Color = "#654321" });
        await contexto.SaveChangesAsync();

        var logica = new CategoriaLogica(contexto);

        // Act
        var resultado = await logica.ObtenerTodosAsync();

        // Assert
        resultado.Should().HaveCount(2);
    }

    [Fact]
    public async Task EliminarAsync_SinTareasAsociadas_EliminaYDevuelveTrue()
    {
        // Arrange
        await using var contexto = CrearContexto(nameof(EliminarAsync_SinTareasAsociadas_EliminaYDevuelveTrue));
        contexto.Categorias.Add(new Categoria { Id = 1, Nombre = "Trabajo", Color = "#123456" });
        await contexto.SaveChangesAsync();

        var logica = new CategoriaLogica(contexto);

        // Act
        var resultado = await logica.EliminarAsync(1);

        // Assert
        resultado.Should().BeTrue();
        (await contexto.Categorias.AnyAsync()).Should().BeFalse();
    }
}
