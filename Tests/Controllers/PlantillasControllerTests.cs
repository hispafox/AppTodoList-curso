using AppTodoList.Controllers;
using AppTodoList.Dtos;
using AppTodoList.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace AppTodoList.Tests.Controllers;

public class PlantillasControllerTests
{
    [Fact]
    public async Task Instanciar_ConPlantillaExistente_DevuelveCreatedAtAction()
    {
        // Arrange
        var mockServicio = new Mock<IPlantillaService>();
        mockServicio.Setup(x => x.InstanciarAsync(1)).ReturnsAsync(new TareaDto { Id = 5, Title = "Instanciada" });
        var controller = new PlantillasController(mockServicio.Object);

        // Act
        var resultado = await controller.Instanciar(1);

        // Assert
        var created = resultado.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        created.StatusCode.Should().Be(201);
    }
}
