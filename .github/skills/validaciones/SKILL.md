---
name: validaciones
description: 'Añade validaciones de entrada y reglas de negocio a la capa de lógica y a los DTOs. Úsalo cuando quieras asegurarte de que los datos recibidos son correctos antes de persistirlos, comprobar la existencia de recursos por identificador, o añadir restricciones de dominio.'
argument-hint: 'Recurso a validar (opcional, por defecto: todos los recursos con endpoints de escritura en el análisis)'
---

# Skill: Añadir Validaciones

## Cuándo usar este skill

- El usuario pide "añadir validaciones", "validar los datos de entrada", "comprobar que los datos son correctos"
- Se quiere asegurar que los campos obligatorios no lleguen vacíos
- Se quiere comprobar la existencia de un recurso por id antes de operar con él
- Se quieren añadir restricciones de dominio (p. ej. no completar una tarea ya completada)

## Prerequisitos

Antes de usar este skill, deben existir:
1. Los DTOs en `Dtos/`. Si no existen, ejecutar primero el skill `dto`.
2. Las clases de lógica de negocio en `LogicaNegocio/`. Si no existen, ejecutar primero el skill `logica-negocio`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección 4 (restricciones de campos) y sección 5 (reglas de negocio por endpoint)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Los DTOs en `Dtos/` — para saber qué campos validar
- Las implementaciones en `LogicaNegocio/` — para saber dónde añadir la lógica de validación

### Paso 2 — Añadir anotaciones de validación a los DTOs de entrada

Abrir los DTOs `Crear<Recurso>Dto` y `Actualizar<Recurso>Dto` y añadir anotaciones de validación de `System.ComponentModel.DataAnnotations` según las restricciones del análisis:

```csharp
public class CrearTareaDto
{
    [Required(ErrorMessage = "El título es obligatorio")]
    [MaxLength(200, ErrorMessage = "El título no puede superar 200 caracteres")]
    public string Titulo { get; set; } = string.Empty;
}
```

#### Anotaciones habituales

| Restricción | Anotación |
|---|---|
| Campo obligatorio | `[Required]` |
| Longitud máxima | `[MaxLength(n)]` |
| Longitud mínima | `[MinLength(n)]` |
| Rango numérico | `[Range(min, max)]` |
| Formato de email | `[EmailAddress]` |
| Solo si se envía, debe cumplir regla | Usar tipo nullable + `[MaxLength]` |

**Nota**: con `[ApiController]`, ASP.NET Core valida el `ModelState` automáticamente antes de llamar al action method y devuelve `400 Bad Request` si hay errores — no hace falta código adicional en el controlador.

### Paso 3 — Añadir validación de existencia en la lógica de negocio

En los métodos de `LogicaNegocio/` que reciben un `id` (`ActualizarAsync`, `EliminarAsync`, y los métodos de acción), el patrón de "comprobar existencia" ya debería estar:

```csharp
var existente = await _contexto.<Recurso>s.FindAsync(id);
if (existente is null)
    return null; // El servicio convierte esto en 404
```

Verificar que **todos** los métodos que usen un `id` sigan este patrón. Si alguno no lo hace, corregirlo.

### Paso 4 — Añadir reglas de negocio específicas del análisis

Revisar la sección 5 del análisis en busca de reglas de negocio adicionales. Ejemplos habituales:

#### Evitar duplicados
```csharp
var existe = await _contexto.TodoItems
    .AnyAsync(t => t.Title == entidad.Title);
if (existe)
    throw new InvalidOperationException("Ya existe una tarea con ese título");
```

#### Validar transición de estado
```csharp
public async Task<TodoItem?> CompletarAsync(int id)
{
    var tarea = await _contexto.TodoItems.FindAsync(id);
    if (tarea is null) return null;
    if (tarea.IsCompleted)
        throw new InvalidOperationException("La tarea ya está completada");

    tarea.IsCompleted = true;
    await _contexto.SaveChangesAsync();
    return tarea;
}
```

#### Validar campos antes de persistir
```csharp
public async Task<TodoItem> CrearAsync(TodoItem entidad)
{
    if (string.IsNullOrWhiteSpace(entidad.Title))
        throw new ArgumentException("El título no puede estar vacío", nameof(entidad.Title));

    entidad.CreatedAt = DateTime.UtcNow;
    _contexto.TodoItems.Add(entidad);
    await _contexto.SaveChangesAsync();
    return entidad;
}
```

### Paso 5 — Propagar el manejo de errores al servicio y controlador

Si se lanzan excepciones en la lógica de negocio, el servicio debe capturarlas y el controlador debe devolver el código HTTP correcto.

**Opción A — excepción capturada en el servicio** (recomendada para la demo):
```csharp
// En el Service
public async Task<TareaDto?> CompletarAsync(int id)
{
    try
    {
        var resultado = await _logica.CompletarAsync(id);
        return resultado is null ? null : MapearADto(resultado);
    }
    catch (InvalidOperationException ex)
    {
        throw; // Re-lanzar para que el controlador decida el código HTTP
    }
}
```

**Opción B — filtro global de excepciones** (si el proyecto ya tiene middleware):
```csharp
// En Program.cs
app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        context.Response.StatusCode = 400;
        context.Response.ContentType = "application/json";
        var error = context.Features.Get<IExceptionHandlerFeature>();
        if (error?.Error is InvalidOperationException ex)
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
    });
});
```

Para la demo, usar solo la Opción A salvo que el usuario pida explícitamente middleware.

### Paso 6 — Confirmar

Informar al usuario con una lista de los ficheros modificados con sus rutas relativas y un resumen de las validaciones añadidas:
- DTOs actualizados con anotaciones
- Métodos de lógica con validación de existencia reforzada
- Reglas de negocio específicas añadidas

Como siguiente paso sugerir ejecutar el skill `servicio` si aún no se ha hecho, o `commit-message` si el trabajo está completo.
