---
name: base-de-datos
description: 'Crea o actualiza el contexto de base de datos (AppDbContext), configura EF Core con SQLite, aplica la configuración Fluent API de las entidades, registra el contexto en Program.cs y genera los comandos de migración. Úsalo cuando quieras conectar la aplicación a la base de datos, crear las migraciones iniciales, o añadir datos de ejemplo.'
argument-hint: 'Acción a realizar (opcional, por defecto: crear AppDbContext completo con todas las entidades del análisis)'
---

# Skill: Conectar con Base de Datos

## Cuándo usar este skill

- El usuario pide "crear el DbContext", "conectar con la base de datos", "configurar EF Core"
- Se quieren crear las migraciones iniciales
- Se quiere añadir datos de ejemplo (seeder)
- Se ha añadido una entidad nueva al modelo y hay que actualizar el DbContext

## Prerequisitos

Antes de usar este skill, deben existir:
1. `docs/analisis-diseño.md` con la sección 4 (modelo de datos) completa. Si no existe, ejecutar primero el skill `diseño-analisis`.
2. Los modelos de dominio en `Models/`. Si no existen, ejecutar primero el skill `modelo`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección 4 (entidades, campos, relaciones, restricciones)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Los modelos en `Models/` — para conocer los tipos exactos de cada propiedad

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar si ya existe AppDbContext

Buscar el fichero `.csproj` del proyecto principal. La carpeta `Data/` siempre es relativa a ese `.csproj`.

Ubicaciones habituales, en orden de preferencia:
1. `src/<NombreProyecto>/Data/` — si hay carpeta `src/`
2. `<NombreProyecto>/Data/` — si el proyecto tiene su propia subcarpeta
3. `Data/` — si el `.csproj` está en la raíz del repositorio

Si ya existe `Data/AppDbContext.cs`, leer su contenido antes de modificar para evitar sobreescribir cambios manuales.

### Paso 3 — Crear `AppDbContext`

Crear el fichero `Data/AppDbContext.cs`.

#### Estructura obligatoria

```csharp
namespace <Namespace>.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Un DbSet<T> por cada entidad de dominio
    public DbSet<TodoItem> TodoItems => Set<TodoItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración Fluent API de cada entidad
        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
        });
    }
}
```

#### Reglas de generación

- **Namespace**: derivar del namespace raíz del `.csproj` + `.Data`.
- **Constructor**: recibe `DbContextOptions<AppDbContext>` y lo pasa a la clase base.
- **Un `DbSet<T>` por entidad**: usar la forma `=> Set<T>()` (inicialización lazy, evita warning de nullability).
- **Fluent API en `OnModelCreating`**: toda la configuración va aquí, nunca en los modelos (sin `[Required]`, `[MaxLength]` en `Models/`).
  - Claves primarias: `HasKey` (EF Core las infiere por convención si se llaman `Id`, pero ser explícito)
  - Propiedades requeridas: `IsRequired()`
  - Longitudes máximas: `HasMaxLength(n)` según el análisis
  - Valores por defecto: `HasDefaultValueSql(...)` para campos de auditoría (`CreatedAt`)
  - Relaciones: `HasOne` / `HasMany` con `WithMany` / `WithOne` y `OnDelete`
- **Sin lógica de negocio** en el DbContext.

### Paso 4 — Registrar el contexto en `Program.cs`

Abrir `Program.cs` y añadir la configuración de EF Core con SQLite:

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
```

Colocar el registro antes de `var app = builder.Build();`.

Si el registro ya existe, no duplicar.

### Paso 5 — Configurar la cadena de conexión

Abrir `appsettings.json` y asegurarse de que existe la sección `ConnectionStrings`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=apptodolist.db"
  }
}
```

Si ya existe con un valor distinto, no sobreescribir — indicárselo al usuario.

### Paso 6 — Crear el seeder (solo si el usuario lo pide o el análisis lo indica)

Si se solicitan datos de ejemplo, crear `Data/DatosEjemplo.cs`:

```csharp
namespace <Namespace>.Data;

public static class DatosEjemplo
{
    public static void Inicializar(AppDbContext contexto)
    {
        if (contexto.TodoItems.Any())
            return; // Ya hay datos, no insertar duplicados

        contexto.TodoItems.AddRange(
            new TodoItem { Title = "Ejemplo 1", CreatedAt = DateTime.UtcNow },
            new TodoItem { Title = "Ejemplo 2", CreatedAt = DateTime.UtcNow }
        );
        contexto.SaveChanges();
    }
}
```

Y añadir la llamada en `Program.cs` después de `var app = builder.Build()`:

```csharp
using (var scope = app.Services.CreateScope())
{
    var contexto = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    contexto.Database.EnsureCreated();
    DatosEjemplo.Inicializar(contexto);
}
```

### Paso 7 — Ejecutar las migraciones

**Ejecutar siempre las migraciones automáticamente** usando el terminal.

Primero, determinar el nombre de la migración:
- Si es la primera migración del proyecto: usar `CreacionInicial`.
- Si ya existen migraciones: usar un nombre descriptivo del cambio (p. ej. `AnadirCampoFecha`).

Ejecutar en orden:

```bash
dotnet ef migrations add <NombreMigracion>
dotnet ef database update
```

Si EF Core Tools no está instalado, instalarlo primero:
```bash
dotnet tool install --global dotnet-ef
```

Si el proyecto no tiene la referencia al paquete de diseño, añadirla primero:
```bash
dotnet add package Microsoft.EntityFrameworkCore.Design
```

Tras ejecutar las migraciones, incluir los ficheros generados en `Migrations/` en el commit.

### Paso 8 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.

Recordar los comandos de migración al final.

Como siguiente paso sugerir ejecutar el skill `logica-negocio`, que inyectará `AppDbContext` para implementar el acceso a datos.
