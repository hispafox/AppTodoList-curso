using AppTodoList.Data;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace AppTodoList.Tests.LogicaNegocio;

public class TodoLogicaTests
{
    private static AppDbContext CrearContexto(string nombreBaseDatos)
    {
        var opciones = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"{nombreBaseDatos}_{Guid.NewGuid():N}")
            .Options;

        return new AppDbContext(opciones);
    }

    [Fact]
    public async Task ObtenerTodosAsync_ConCategoriaEspecifica_DevuelveSoloTareasDeEsaCategoria()
    {
        // Arrange
        await using var contexto = CrearContexto(nameof(ObtenerTodosAsync_ConCategoriaEspecifica_DevuelveSoloTareasDeEsaCategoria));
        contexto.Categorias.AddRange(
            new Categoria { Id = 1, Nombre = "Trabajo", Color = "#123456" },
            new Categoria { Id = 2, Nombre = "Personal", Color = "#654321" });
        contexto.TodoItems.AddRange(
            new TodoItem { Id = 1, Title = "Tarea 1", CategoriaId = 1 },
            new TodoItem { Id = 2, Title = "Tarea 2", CategoriaId = 2 });
        await contexto.SaveChangesAsync();

        var logica = new TodoLogica(contexto);

        // Act
        var resultado = await logica.ObtenerTodosAsync(1);

        // Assert
        resultado.Should().HaveCount(1);
        resultado.First().Title.Should().Be("Tarea 1");
    }

    [Fact]
    public async Task CrearAsync_ConUsuarioInexistente_LanzaArgumentException()
    {
        // Arrange
        await using var contexto = CrearContexto(nameof(CrearAsync_ConUsuarioInexistente_LanzaArgumentException));
        var logica = new TodoLogica(contexto);
        var entidad = new TodoItem { Title = "Nueva tarea", UsuarioAsignadoId = 99 };

        // Act
        Func<Task> accion = async () => await logica.CrearAsync(entidad);

        // Assert
        await accion.Should().ThrowAsync<ArgumentException>();
    }

    [Fact]
    public async Task ActualizarAsync_ConIdInexistente_DevuelveNull()
    {
        // Arrange
        await using var contexto = CrearContexto(nameof(ActualizarAsync_ConIdInexistente_DevuelveNull));
        var logica = new TodoLogica(contexto);

        // Act
        var resultado = await logica.ActualizarAsync(99, new TodoItem { Title = "Cambiar" });

        // Assert
        resultado.Should().BeNull();
    }

    [Fact]
    public async Task CompletarAsync_ConTareaRepetitiva_CreaNuevaTareaYMarcaActualComoCompletada()
    {
        // Arrange
        await using var contexto = CrearContexto(nameof(CompletarAsync_ConTareaRepetitiva_CreaNuevaTareaYMarcaActualComoCompletada));
        contexto.TodoItems.Add(new TodoItem
        {
            Id = 1,
            Title = "Diaria",
            EsRepetitiva = true,
            Recurrencia = TipoRecurrencia.Diaria,
            IsCompleted = false
        });
        await contexto.SaveChangesAsync();

        var logica = new TodoLogica(contexto);

        // Act
        var resultado = await logica.CompletarAsync(1);

        // Assert
        resultado.Should().NotBeNull();
        resultado!.IsCompleted.Should().BeFalse();
        contexto.TodoItems.Count().Should().Be(2);
        var tareaOriginal = await contexto.TodoItems.SingleAsync(t => t.Id == 1);
        tareaOriginal.IsCompleted.Should().BeTrue();
    }
}
