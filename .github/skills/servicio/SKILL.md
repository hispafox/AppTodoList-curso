---
name: servicio
description: 'Crea o actualiza las interfaces e implementaciones de servicios de la aplicación. Úsalo cuando quieras generar la capa de servicios, añadir un nuevo método a un servicio existente, o sincronizar los servicios con el documento de análisis y diseño.'
argument-hint: 'Recurso a generar (opcional, por defecto: todos los recursos de la sección 5 del análisis)'
---

# Skill: Crear Servicios ASP.NET Core

## Responsabilidad de esta capa

El servicio es la capa de **orquestación**: recibe DTOs del controlador, los convierte a entidades de dominio, delega las operaciones a la lógica de negocio (`LogicaNegocio/`), y convierte el resultado de vuelta a DTOs para la respuesta.

```
Controlador → [DTO entrada] → Servicio → [Entidad] → LogicaNegocio → DbContext
Controlador ← [DTO salida] ← Servicio ← [Entidad] ← LogicaNegocio ← DbContext
```

El servicio **no accede a `AppDbContext` directamente** — eso es responsabilidad de la lógica de negocio.

## Cuándo usar este skill

- El usuario pide "crear el servicio", "generar los servicios", "crear la capa de servicios"
- Se quiere sincronizar los servicios con los endpoints definidos en el análisis
- Se ha añadido un nuevo recurso al análisis y hay que crear su servicio
- Se quiere añadir un método nuevo a un servicio existente

## Prerequisitos

Antes de usar este skill, deben existir:
1. `docs/analisis-diseño.md` con la sección 5 (endpoints) completa. Si no existe, ejecutar primero el skill `diseño-analisis`.
2. Los modelos de dominio en `Models/`. Si no existen, ejecutar primero el skill `modelo`.
3. Los DTOs en `Dtos/`. Si no existen, ejecutar primero el skill `dto`.
4. Las clases de lógica de negocio en `LogicaNegocio/`. Si no existen, ejecutar primero el skill `logica-negocio`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — fuente de verdad de los endpoints (sección 5) y la arquitectura (sección 3)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Los modelos en `Models/` — para conocer las entidades de dominio
- Los DTOs en `Dtos/` — para conocer los contratos de entrada y salida
- Las interfaces de lógica en `LogicaNegocio/` — para conocer qué métodos delegar

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar qué servicios existen

Buscar el fichero `.csproj` del proyecto principal (excluir proyectos de tests). La carpeta `Services/` siempre es relativa a ese `.csproj`.

Ubicaciones habituales, en orden de preferencia:
1. `src/<NombreProyecto>/Services/` — si hay carpeta `src/`
2. `<NombreProyecto>/Services/` — si el proyecto tiene su propia subcarpeta
3. `Services/` — si el `.csproj` está en la raíz del repositorio

Una vez localizada la carpeta, comprobar qué ficheros contiene.
Si ya existen servicios, leer su contenido y **verificar que usan DTOs en la firma pública**:

- Los métodos de la interfaz `I<Recurso>Service` deben recibir `Crear<Recurso>Dto` / `Actualizar<Recurso>Dto` y devolver `<Recurso>Dto`.
- Si los servicios existentes reciben o devuelven entidades directamente, **sobreescribirlos** para que cumplan el contrato de DTOs. El mapeo DTO ↔ entidad siempre vive en esta capa.

### Paso 3 — Identificar los métodos del servicio

Para cada recurso de la sección 5, los métodos del servicio trabajan con **DTOs en la firma pública** (lo que ve el controlador) y con **entidades** internamente (lo que pasa a la lógica):

| Endpoint | Método del servicio |
|---|---|
| `GET /api/<recurso>` | `ObtenerTodosAsync() → IEnumerable<<Recurso>Dto>` |
| `GET /api/<recurso>/{id}` | `ObtenerPorIdAsync(int id) → <Recurso>Dto?` |
| `POST /api/<recurso>` | `CrearAsync(Crear<Recurso>Dto dto) → <Recurso>Dto` |
| `PUT /api/<recurso>/{id}` | `ActualizarAsync(int id, Actualizar<Recurso>Dto dto) → <Recurso>Dto?` |
| `DELETE /api/<recurso>/{id}` | `EliminarAsync(int id) → bool` |
| `POST /api/<recurso>/{id}/<accion>` | `<Accion>Async(int id) → <Recurso>Dto?` |

### Paso 4 — Generar la interfaz e implementación por recurso

Crear los ficheros `I<Recurso>Service.cs` y `<Recurso>Service.cs` dentro de `Services/`.

#### Estructura obligatoria de la interfaz

```csharp
namespace <Namespace>.Services;

public interface I<Recurso>Service
{
    Task<IEnumerable<<Recurso>Dto>> ObtenerTodosAsync();
    Task<<Recurso>Dto?> ObtenerPorIdAsync(int id);
    Task<<Recurso>Dto> CrearAsync(Crear<Recurso>Dto dto);
    Task<<Recurso>Dto?> ActualizarAsync(int id, Actualizar<Recurso>Dto dto);
    Task<bool> EliminarAsync(int id);
    // Métodos adicionales según endpoints de acción del análisis
}
```

#### Estructura obligatoria de la implementación

```csharp
namespace <Namespace>.Services;

public class <Recurso>Service : I<Recurso>Service
{
    private readonly I<Recurso>Logica _logica;

    public <Recurso>Service(I<Recurso>Logica logica)
    {
        _logica = logica;
    }

    public async Task<IEnumerable<<Recurso>Dto>> ObtenerTodosAsync()
    {
        var entidades = await _logica.ObtenerTodosAsync();
        return entidades.Select(e => MapearADto(e));
    }

    public async Task<<Recurso>Dto?> ObtenerPorIdAsync(int id)
    {
        var entidad = await _logica.ObtenerPorIdAsync(id);
        return entidad is null ? null : MapearADto(entidad);
    }

    public async Task<<Recurso>Dto> CrearAsync(Crear<Recurso>Dto dto)
    {
        var entidad = new <Recurso>
        {
            // Mapear campos del DTO a la entidad
        };
        var creada = await _logica.CrearAsync(entidad);
        return MapearADto(creada);
    }

    public async Task<<Recurso>Dto?> ActualizarAsync(int id, Actualizar<Recurso>Dto dto)
    {
        var entidad = new <Recurso>
        {
            // Mapear campos del DTO a la entidad
        };
        var actualizada = await _logica.ActualizarAsync(id, entidad);
        return actualizada is null ? null : MapearADto(actualizada);
    }

    public async Task<bool> EliminarAsync(int id)
        => await _logica.EliminarAsync(id);

    private static <Recurso>Dto MapearADto(<Recurso> entidad) => new()
    {
        Id = entidad.Id,
        // Mapear el resto de campos
    };
}
```

#### Reglas de generación

- **Namespace**: derivar del namespace raíz del `.csproj` + `.Services`.
- **Inyección de dependencias**: constructor con `I<Recurso>Logica`, almacenado en campo `readonly` privado. Nunca `new` directo.
- **`async/await`** en todos los métodos que deleguen a la lógica.
- **La firma pública usa DTOs**: parámetros de entrada son DTOs de entrada (`Crear<Recurso>Dto`, `Actualizar<Recurso>Dto`), retornos son DTOs de salida (`<Recurso>Dto`).
- **El mapeo DTO ↔ entidad se hace aquí**: método privado `MapearADto` para entidad → DTO de salida; mapeo inline en los métodos de creación/actualización para DTO de entrada → entidad.
- **Sin lógica HTTP**: el servicio no conoce `ActionResult`, `StatusCode` ni nada de HTTP.
- **Sin acceso a `AppDbContext`**: toda operación de datos se delega a `I<Recurso>Logica`.
- **Nombres de métodos**: en castellano, con sufijo `Async`.
- Si los DTOs **no existen aún**, generar la implementación con comentarios `// TODO: mapear <Recurso>Dto` y advertir al usuario.
- Si la lógica de negocio **no existe aún**, generar la interfaz del servicio y advertir al usuario.

### Paso 5 — Registrar los servicios en `Program.cs`

Abrir `Program.cs` y añadir el registro de cada servicio generado como `Scoped`:

```csharp
builder.Services.AddScoped<I<Recurso>Service, <Recurso>Service>();
```

Colocar los registros agrupados con los de lógica de negocio, antes de `var app = builder.Build();`.
Si ya estaba registrado, no duplicar la línea.

### Paso 6 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.

Si algún prerequisito faltaba (DTOs, lógica de negocio), indicarlo explícitamente.

Si los controladores aún no existen, sugerir ejecutar el skill `controlador` como siguiente paso.
Si los controladores ya existían pero referencian estos servicios, indicar que ya deberían compilar correctamente.
