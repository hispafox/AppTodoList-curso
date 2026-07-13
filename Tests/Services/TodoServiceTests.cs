using AppTodoList.Dtos;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;
using AppTodoList.Services;
using FluentAssertions;
using Moq;

namespace AppTodoList.Tests.Services;

public class TodoServiceTests
{
    [Fact]
    public async Task ObtenerPorIdAsync_ConEntidadExistente_DevuelveDtoMapeado()
    {
        // Arrange
        var mockLogica = new Mock<ITodoLogica>();
        mockLogica.Setup(x => x.ObtenerPorIdAsync(1))
            .ReturnsAsync(new TodoItem
            {
                Id = 1,
                Title = "Tarea",
                IsCompleted = true,
                CreatedAt = new DateTime(2026, 1, 1),
                EsRepetitiva = true,
                Recurrencia = TipoRecurrencia.Mensual,
                ProximaFecha = new DateTime(2026, 2, 1),
                UsuarioAsignado = new UsuarioAsignado { Nombre = "Ana" },
                Categoria = new Categoria { Nombre = "Trabajo" }
            });

        var servicio = new TodoService(mockLogica.Object);

        // Act
        var resultado = await servicio.ObtenerPorIdAsync(1);

        // Assert
        resultado.Should().NotBeNull();
        resultado!.Title.Should().Be("Tarea");
        resultado.UsuarioAsignadoNombre.Should().Be("Ana");
        resultado.CategoriaNombre.Should().Be("Trabajo");
    }

    [Fact]
    public async Task CrearAsync_ConDtoValido_LlamaLogicaConEntidadMapeada()
    {
        // Arrange
        var mockLogica = new Mock<ITodoLogica>();
        mockLogica.Setup(x => x.CrearAsync(It.IsAny<TodoItem>()))
            .ReturnsAsync(new TodoItem { Id = 7, Title = "Nueva" });

        var servicio = new TodoService(mockLogica.Object);
        var dto = new CrearTareaDto { Title = "Nueva", EsRepetitiva = true, Recurrencia = TipoRecurrencia.Diaria };

        // Act
        var resultado = await servicio.CrearAsync(dto);

        // Assert
        resultado.Id.Should().Be(7);
        resultado.Title.Should().Be("Nueva");
        mockLogica.Verify(x => x.CrearAsync(It.Is<TodoItem>(t => t.Title == "Nueva" && t.EsRepetitiva)), Times.Once);
    }

    [Fact]
    public async Task CompletarAsync_ConResultado_DevuelveDtoMapeado()
    {
        // Arrange
        var mockLogica = new Mock<ITodoLogica>();
        mockLogica.Setup(x => x.CompletarAsync(1))
            .ReturnsAsync(new TodoItem { Id = 1, Title = "Completada" });

        var servicio = new TodoService(mockLogica.Object);

        // Act
        var resultado = await servicio.CompletarAsync(1);

        // Assert
        resultado.Should().NotBeNull();
        resultado!.Title.Should().Be("Completada");
    }
}
