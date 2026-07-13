using AppTodoList.Dtos;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;
using AppTodoList.Services;
using FluentAssertions;
using Moq;

namespace AppTodoList.Tests.Services;

public class CategoriaServiceTests
{
    [Fact]
    public async Task CrearAsync_ConDtoValido_DevuelveDtoMapeado()
    {
        // Arrange
        var mockLogica = new Mock<ICategoriaLogica>();
        mockLogica.Setup(x => x.CrearAsync(It.IsAny<Categoria>()))
            .ReturnsAsync(new Categoria { Id = 3, Nombre = "Trabajo", Color = "#112233" });

        var servicio = new CategoriaService(mockLogica.Object);
        var dto = new CrearCategoriaDto { Nombre = "Trabajo", Color = "#112233" };

        // Act
        var resultado = await servicio.CrearAsync(dto);

        // Assert
        resultado.Id.Should().Be(3);
        resultado.Nombre.Should().Be("Trabajo");
        resultado.Color.Should().Be("#112233");
    }

    [Fact]
    public async Task EliminarAsync_DelegadoALogica_DevuelveResultado()
    {
        // Arrange
        var mockLogica = new Mock<ICategoriaLogica>();
        mockLogica.Setup(x => x.EliminarAsync(4)).ReturnsAsync(true);
        var servicio = new CategoriaService(mockLogica.Object);

        // Act
        var resultado = await servicio.EliminarAsync(4);

        // Assert
        resultado.Should().BeTrue();
    }
}
