using AppTodoList.Data;
using AppTodoList.LogicaNegocio;
using AppTodoList.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITodoLogica, TodoLogica>();
builder.Services.AddScoped<IPlantillaLogica, PlantillaLogica>();

builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<IPlantillaService, PlantillaService>();
builder.Services.AddScoped<IUsuarioAsignadoService, UsuarioAsignadoService>();

builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var contexto = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DatosEjemplo.Inicializar(contexto);
}

app.MapControllers();

app.Run();
