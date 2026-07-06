---
name: logica-negocio
description: 'Crea o actualiza las interfaces e implementaciones de la capa de lógica de negocio. Úsalo cuando quieras generar las clases que contienen las reglas de negocio y el acceso a datos, separadas de la orquestación de servicios.'
argument-hint: 'Recurso a generar (opcional, por defecto: todos los recursos de la sección 5 del análisis)'
---

# Skill: Crear Lógica de Negocio

## Cuándo usar este skill

- El usuario pide "crear la lógica de negocio", "generar la capa de lógica", "crear los managers / handlers"
- Se quiere encapsular las reglas de dominio separadas de la orquestación del servicio
- Se ha añadido un nuevo recurso al análisis y hay que crear su lógica de negocio
- Se quiere añadir una regla de negocio nueva a un recurso existente

## Prerequisitos

Antes de usar este skill, deben existir:
1. `docs/analisis-diseño.md` con la sección 4 y 5 completas. Si no existe, ejecutar primero el skill `diseño-analisis`.
2. Los modelos de dominio en `Models/`. Si no existen, ejecutar primero el skill `modelo`.
3. `Data/AppDbContext.cs` con los `DbSet<T>` de cada entidad. Si no existe, ejecutar primero el skill `base-de-datos`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección 4 (modelo) y sección 5 (operaciones y reglas por endpoint)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Los modelos en `Models/` — para conocer las entidades y sus relaciones

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar qué lógica existe

Buscar el fichero `.csproj` del proyecto principal (excluir proyectos de tests). La carpeta `LogicaNegocio/` siempre es relativa a ese `.csproj`.

Ubicaciones habituales, en orden de preferencia:
1. `src/<NombreProyecto>/LogicaNegocio/` — si hay carpeta `src/`
2. `<NombreProyecto>/LogicaNegocio/` — si el proyecto tiene su propia subcarpeta
3. `LogicaNegocio/` — si el `.csproj` está en la raíz del repositorio

Una vez localizada la carpeta, comprobar qué ficheros contiene.
Si ya existen clases de lógica, leer su contenido antes de modificar para evitar sobreescribir cambios manuales.

### Paso 3 — Identificar las operaciones de la sección 5

Por cada recurso de la sección 5, derivar los métodos de lógica de negocio a partir de los endpoints. Los métodos trabajan siempre con entidades de dominio (de `Models/`), no con DTOs:

| Endpoint | Método de lógica |
|---|---|
| `GET /api/<recurso>` | `ObtenerTodosAsync()` |
| `GET /api/<recurso>/{id}` | `ObtenerPorIdAsync(int id)` |
| `POST /api/<recurso>` | `CrearAsync(<Recurso> entidad)` |
| `PUT /api/<recurso>/{id}` | `ActualizarAsync(int id, <Recurso> entidad)` |
| `DELETE /api/<recurso>/{id}` | `EliminarAsync(int id)` |
| `POST /api/<recurso>/{id}/<accion>` | `<Accion>Async(int id)` |

### Paso 4 — Generar la interfaz e implementación por recurso

Crear los ficheros `I<Recurso>Logica.cs` y `<Recurso>Logica.cs` dentro de `LogicaNegocio/`.

#### Estructura obligatoria de la interfaz

```csharp
namespace <Namespace>.LogicaNegocio;

public interface I<Recurso>Logica
{
    Task<IEnumerable<<Recurso>>> ObtenerTodosAsync();
    Task<<Recurso>?> ObtenerPorIdAsync(int id);
    Task<<Recurso>> CrearAsync(<Recurso> entidad);
    Task<<Recurso>?> ActualizarAsync(int id, <Recurso> entidad);
    Task<bool> EliminarAsync(int id);
    // Métodos adicionales según endpoints de acción del análisis
}
```

#### Estructura obligatoria de la implementación

```csharp
namespace <Namespace>.LogicaNegocio;

public class <Recurso>Logica : I<Recurso>Logica
{
    private readonly AppDbContext _contexto;

    public <Recurso>Logica(AppDbContext contexto)
    {
        _contexto = contexto;
    }

    public async Task<IEnumerable<<Recurso>>> ObtenerTodosAsync()
        => await _contexto.<Recurso>s.ToListAsync();

    public async Task<<Recurso>?> ObtenerPorIdAsync(int id)
        => await _contexto.<Recurso>s.FindAsync(id);

    public async Task<<Recurso>> CrearAsync(<Recurso> entidad)
    {
        _contexto.<Recurso>s.Add(entidad);
        await _contexto.SaveChangesAsync();
        return entidad;
    }

    public async Task<<Recurso>?> ActualizarAsync(int id, <Recurso> entidad)
    {
        var existente = await _contexto.<Recurso>s.FindAsync(id);
        if (existente is null)
            return null;

        // Actualizar campos según el análisis + aplicar reglas de negocio aquí
        await _contexto.SaveChangesAsync();
        return existente;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var existente = await _contexto.<Recurso>s.FindAsync(id);
        if (existente is null)
            return false;

        _contexto.<Recurso>s.Remove(existente);
        await _contexto.SaveChangesAsync();
        return true;
    }
}
```

#### Reglas de generación

- **Namespace**: derivar del namespace raíz del `.csproj` + `.LogicaNegocio`.
- **Inyección de dependencias**: constructor con `AppDbContext`, almacenado en campo `readonly` privado. Nunca `new` directo.
- **`async/await`** en todos los métodos que accedan a base de datos.
- **Trabaja con entidades de dominio**: los parámetros y retornos son tipos de `Models/`, nunca DTOs. El mapeo DTO ↔ entidad es responsabilidad del servicio.
- **Aquí van las reglas de negocio**: validaciones de dominio, cálculos, estados de la entidad. Por ejemplo: no se puede completar una tarea ya completada, no se puede instanciar una plantilla inactiva.
- **Tipos de retorno nullable** (`T?`, `bool`) cuando el recurso puede no existir — el servicio decide cómo manejarlo.
- **Sin lógica HTTP**: no conoce `ActionResult`, `StatusCode` ni nada de la capa de presentación.
- Si `AppDbContext` **no existe aún**, generar la interfaz completa y la implementación con `// TODO: inyectar AppDbContext`, y advertir al usuario.

#### Tipos de retorno según operación

| Situación | Tipo de retorno recomendado |
|---|---|
| Siempre devuelve resultados (lista) | `Task<IEnumerable<T>>` |
| Puede no encontrar el elemento | `Task<T?>` (nullable) |
| Operación de borrado | `Task<bool>` (true si se borró, false si no existía) |
| Acción especial que modifica y devuelve la entidad | `Task<T?>` |

### Paso 5 — Registrar la lógica en `Program.cs`

Abrir `Program.cs` y añadir el registro de cada clase de lógica generada como `Scoped`:

```csharp
builder.Services.AddScoped<I<Recurso>Logica, <Recurso>Logica>();
```

Colocar los registros agrupados antes de `var app = builder.Build();`, junto a los registros de servicios.
Si ya estaba registrado, no duplicar la línea.

### Paso 6 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.

Si `AppDbContext` no existía, indicarlo explícitamente.

Como siguiente paso sugerir ejecutar el skill `servicio`, que inyectará `I<Recurso>Logica` y se encargará del mapeo con los DTOs.
