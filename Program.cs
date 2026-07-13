using AppTodoList.Data;
using AppTodoList.LogicaNegocio;
using AppTodoList.Services;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Scalar.AspNetCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITodoLogica, TodoLogica>();
builder.Services.AddScoped<IPlantillaLogica, PlantillaLogica>();
builder.Services.AddScoped<IUsuarioAsignadoLogica, UsuarioAsignadoLogica>();
builder.Services.AddScoped<ICategoriaLogica, CategoriaLogica>();

builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<IPlantillaService, PlantillaService>();
builder.Services.AddScoped<IUsuarioAsignadoService, UsuarioAsignadoService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>(name: "database", tags: new[] { "db", "sql" });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var contexto = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        contexto.Database.EnsureCreated();
        DatosEjemplo.Inicializar(contexto);
    }
    catch (Exception ex)
    {
        // Si la base de datos no está accesible, la aplicación arranca igualmente:
        // es el endpoint /health quien tiene que contarlo, devolviendo un 503.
        // Una app que se cae al arrancar no puede informar de que está enferma.
        app.Logger.LogError(ex, "No se pudo preparar la base de datos al arrancar. /health devolverá Unhealthy.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapControllers();

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json; charset=utf-8";

        var result = JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            totalDuration = report.TotalDuration.ToString(),
            entries = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                duration = e.Value.Duration.ToString(),
                // Quien monitoriza necesita saber POR QUÉ está enfermo, no solo que lo está.
                // AddDbContextCheck puede devolver Unhealthy sin descripción ni excepción
                // (solo un CanConnect en falso), así que aquí se le pone motivo siempre.
                description = e.Value.Description
                    ?? e.Value.Exception?.Message
                    ?? (e.Value.Status != HealthStatus.Healthy
                        ? "No se puede conectar con la base de datos."
                        : null),
                data = e.Value.Data
            })
        }, new JsonSerializerOptions { WriteIndented = true });

        await context.Response.WriteAsync(result);
    }
});

app.Run();

// Hacer Program accesible para los tests de integración
public partial class Program { }
