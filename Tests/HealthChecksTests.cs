using System.Net;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AppTodoList.Tests;

/// <summary>
/// Tests de integración para el endpoint /health
/// </summary>
public class HealthChecksTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public HealthChecksTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HealthCheck_ReturnsHealthyWhenDatabaseIsAccessible()
    {
        // Act
        var response = await _client.GetAsync("/health");
        var content = await response.Content.ReadAsStringAsync();
        var healthResponse = JsonSerializer.Deserialize<HealthCheckResponse>(content, new JsonSerializerOptions 
        { 
            PropertyNameCaseInsensitive = true 
        });

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK, "la base de datos debe estar accesible");
        healthResponse.Should().NotBeNull();
        healthResponse!.Status.Should().Be("Healthy");
        
        // Verificar que incluye el check de base de datos
        healthResponse.Entries.Should().ContainSingle(e => e.Name == "database");
        var dbCheck = healthResponse.Entries.First(e => e.Name == "database");
        dbCheck.Status.Should().Be("Healthy");
    }

    [Fact]
    public async Task HealthCheck_ReturnsUnhealthyWhenDatabaseIsNotAccessible()
    {
        // Arrange - crear factory con BD inválida
        var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Reemplazar DbContext con conexión inválida
                    var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(Microsoft.EntityFrameworkCore.DbContextOptions<Data.AppDbContext>));
                    if (descriptor != null) services.Remove(descriptor);
                    
                    // Ojo: no basta con un FICHERO que no existe — SQLite lo crearía y el
                    // health check saldría Healthy. Hay que apuntar a una CARPETA inexistente,
                    // donde no puede crear nada.
                    var carpetaInexistente = Path.Combine(
                        Path.GetTempPath(), $"no-existe-{Guid.NewGuid():N}", "tareas.db");

                    services.AddDbContext<Data.AppDbContext>(options =>
                        options.UseSqlite($"Data Source={carpetaInexistente}"));
                });
            });
        
        var client = factory.CreateClient();

        // Act
        var response = await client.GetAsync("/health");
        var content = await response.Content.ReadAsStringAsync();
        var healthResponse = JsonSerializer.Deserialize<HealthCheckResponse>(content, 
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.ServiceUnavailable, 
            "debe retornar 503 cuando la BD no es accesible");
        healthResponse.Should().NotBeNull();
        healthResponse!.Status.Should().Be("Unhealthy");
        
        var dbCheck = healthResponse.Entries.First(e => e.Name == "database");
        dbCheck.Status.Should().Be("Unhealthy");
        dbCheck.Description.Should().NotBeNullOrEmpty("debe incluir descripción del error");
    }

    [Fact]
    public async Task HealthCheck_IncludesDetailedInformation()
    {
        // Act
        var response = await _client.GetAsync("/health");
        var content = await response.Content.ReadAsStringAsync();
        var healthResponse = JsonSerializer.Deserialize<HealthCheckResponse>(content, new JsonSerializerOptions 
        { 
            PropertyNameCaseInsensitive = true 
        });

        // Assert
        healthResponse.Should().NotBeNull();
        
        // Verificar propiedades principales
        healthResponse!.Status.Should().NotBeNullOrEmpty();
        healthResponse.TotalDuration.Should().NotBeNullOrEmpty();
        healthResponse.Entries.Should().NotBeEmpty();
        
        // Verificar estructura de cada entry
        foreach (var entry in healthResponse.Entries)
        {
            entry.Name.Should().NotBeNullOrEmpty();
            entry.Status.Should().NotBeNullOrEmpty();
            entry.Duration.Should().NotBeNullOrEmpty();
        }
    }

    [Fact]
    public async Task HealthCheck_RespondsWithinTimeout()
    {
        // Arrange
        var timeout = TimeSpan.FromSeconds(5);
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        // Act
        var response = await _client.GetAsync("/health");
        stopwatch.Stop();

        // Assert
        response.Should().NotBeNull();
        stopwatch.Elapsed.Should().BeLessThan(timeout, "el health check debe responder en menos de 5 segundos");
    }

    [Fact]
    public async Task HealthCheck_ReturnsJsonContentType()
    {
        // Act
        var response = await _client.GetAsync("/health");

        // Assert
        response.Content.Headers.ContentType.Should().NotBeNull();
        response.Content.Headers.ContentType!.MediaType.Should().Be("application/json");
        response.Content.Headers.ContentType.CharSet.Should().Be("utf-8");
    }

    /// <summary>
    /// Modelo para deserializar la respuesta del health check
    /// </summary>
    private class HealthCheckResponse
    {
        public string Status { get; set; } = string.Empty;
        public string TotalDuration { get; set; } = string.Empty;
        public List<HealthCheckEntry> Entries { get; set; } = new();
    }

    private class HealthCheckEntry
    {
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Dictionary<string, object>? Data { get; set; }
    }
}
