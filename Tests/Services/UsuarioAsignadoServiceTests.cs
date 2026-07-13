using AppTodoList.Dtos;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;
using AppTodoList.Services;
using FluentAssertions;
using Moq;

namespace AppTodoList.Tests.Services;

public class UsuarioAsignadoServiceTests
{
    [Fact]
    public async Task CrearAsync_ConDtoValido_DevuelveDtoMapeado()
    {
        // Arrange
        var mockLogica = new Mock<IUsuarioAsignadoLogica>();
        mockLogica.Setup(x => x.CrearAsync(It.IsAny<UsuarioAsignado>()))
            .ReturnsAsync(new UsuarioAsignado { Id = 2, Nombre = "Ana", Email = "ana@test.com" });

        var servicio = new UsuarioAsignadoService(mockLogica.Object);
        var dto = new CrearUsuarioAsignadoDto { Nombre = "Ana", Email = "ana@test.com" };

        // Act
        var resultado = await servicio.CrearAsync(dto);

        // Assert
        resultado.Id.Should().Be(2);
        resultado.Nombre.Should().Be("Ana");
        resultado.Email.Should().Be("ana@test.com");
    }
}
