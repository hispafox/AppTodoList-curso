using AppTodoList.Controllers;
using AppTodoList.Dtos;
using AppTodoList.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace AppTodoList.Tests.Controllers;

public class TareasControllerTests
{
    [Fact]
    public async Task ObtenerPorId_ConIdInexistente_DevuelveNotFound()
    {
        // Arrange
        var mockServicio = new Mock<ITodoService>();
        mockServicio.Setup(x => x.ObtenerPorIdAsync(99)).ReturnsAsync((TareaDto?)null);
        var controller = new TareasController(mockServicio.Object);

        // Act
        var resultado = await controller.ObtenerPorId(99);

        // Assert
        resultado.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Crear_ConDatosValidos_DevuelveCreatedAtAction()
    {
        // Arrange
        var mockServicio = new Mock<ITodoService>();
        mockServicio.Setup(x => x.CrearAsync(It.IsAny<CrearTareaDto>()))
            .ReturnsAsync(new TareaDto { Id = 1, Title = "Nueva" });
        var controller = new TareasController(mockServicio.Object);
        var dto = new CrearTareaDto { Title = "Nueva" };

        // Act
        var resultado = await controller.Crear(dto);

        // Assert
        var created = resultado.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        created.StatusCode.Should().Be(201);
        created.Value.Should().BeOfType<TareaDto>();
    }

    [Fact]
    public async Task Eliminar_ConTareaInexistente_DevuelveNotFound()
    {
        // Arrange
        var mockServicio = new Mock<ITodoService>();
        mockServicio.Setup(x => x.EliminarAsync(42)).ReturnsAsync(false);
        var controller = new TareasController(mockServicio.Object);

        // Act
        var resultado = await controller.Eliminar(42);

        // Assert
        resultado.Should().BeOfType<NotFoundResult>();
    }
}
