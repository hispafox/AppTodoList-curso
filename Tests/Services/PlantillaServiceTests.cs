using AppTodoList.Dtos;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;
using AppTodoList.Services;
using FluentAssertions;
using Moq;

namespace AppTodoList.Tests.Services;

public class PlantillaServiceTests
{
    [Fact]
    public async Task InstanciarAsync_ConPlantillaExistente_DevuelveTareaDto()
    {
        // Arrange
        var mockLogica = new Mock<IPlantillaLogica>();
        mockLogica.Setup(x => x.InstanciarAsync(1))
            .ReturnsAsync(new TodoItem { Id = 10, Title = "Generada", PlantillaId = 1 });

        var servicio = new PlantillaService(mockLogica.Object);

        // Act
        var resultado = await servicio.InstanciarAsync(1);

        // Assert
        resultado.Should().NotBeNull();
        resultado!.Title.Should().Be("Generada");
        resultado.PlantillaId.Should().Be(1);
    }
}
