var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/", () => "AppTodoList — checkpoint 3.2 (modelo generado desde el análisis).");

app.Run();
