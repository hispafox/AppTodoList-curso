using AppTodoList.Data;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace AppTodoList.Tests.LogicaNegocio;

public class PlantillaLogicaTests
{
    private static AppDbContext CrearContexto(string nombreBaseDatos)
    {
        var opciones = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"{nombreBaseDatos}_{Guid.NewGuid():N}")
            .Options;

        return new AppDbContext(opciones);
    }

    [Fact]
    public async Task InstanciarAsync_ConPlantillaExistente_CreaTareaDesdePlantilla()
    {
        // Arrange
        await using var contexto = CrearContexto(nameof(InstanciarAsync_ConPlantillaExistente_CreaTareaDesdePlantilla));
        contexto.PlantillasTarea.Add(new PlantillaTarea { Id = 1, Titulo = "Plantilla", EsRepetitiva = true, Recurrencia = TipoRecurrencia.Semanal });
        await contexto.SaveChangesAsync();

        var logica = new PlantillaLogica(contexto);

        // Act
        var resultado = await logica.InstanciarAsync(1);

        // Assert
        resultado.Should().NotBeNull();
        resultado!.PlantillaId.Should().Be(1);
        resultado.Title.Should().Be("Plantilla");
        contexto.TodoItems.Should().ContainSingle();
    }

    [Fact]
    public async Task ActualizarAsync_ConIdInexistente_DevuelveNull()
    {
        // Arrange
        await using var contexto = CrearContexto(nameof(ActualizarAsync_ConIdInexistente_DevuelveNull));
        var logica = new PlantillaLogica(contexto);

        // Act
        var resultado = await logica.ActualizarAsync(99, new PlantillaTarea { Titulo = "X" });

        // Assert
        resultado.Should().BeNull();
    }
}
