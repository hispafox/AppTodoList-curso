using AppTodoList.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<IPlantillaService, PlantillaService>();

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Run();
