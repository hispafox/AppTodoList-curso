# Plan: Sistema de Categorías para Tareas

> Generado por el agente planificador · 2026-06-25

## 1. Resumen

Implementar un sistema de categorías para clasificar tareas con relación 1:N (una categoría puede tener múltiples tareas), permitiendo CRUD completo de categorías, filtrado de tareas por categoría, y validación para evitar eliminación de categorías con tareas asociadas.

## 2. Requisitos funcionales

1. El usuario puede crear, consultar, actualizar y eliminar categorías con nombre y color.
2. El usuario puede asignar una categoría a una tarea (campo opcional).
3. El usuario puede filtrar tareas por categoría mediante query param `categoriaId`.
4. El sistema impide eliminar una categoría si tiene tareas asociadas activas.
5. Las tareas existentes sin categoría siguen funcionando (`CategoriaId` nullable).

## 3. Cambios en el modelo de datos

### Entidades nuevas o modificadas

| Entidad | Campo | Tipo | Restricciones | Descripción |
|---------|-------|------|---------------|-------------|
| **Categoria** (nueva) | Id | int | PK, identidad | Identificador único |
| | Nombre | string | Requerido, max 100 chars | Nombre de la categoría |
| | Color | string | Requerido, formato hex (#RRGGBB) | Color visual en formato hex |
| | Tareas | ICollection\<TodoItem\> | Navegación | Tareas asociadas a esta categoría |
| **TodoItem** (modificar) | CategoriaId | int? | Nullable, FK a Categoria | Referencia a la categoría asignada |
| | Categoria | Categoria? | Navegación virtual | Objeto categoría relacionado |

### Migración necesaria

**Nombre sugerido:** `AgregarCategoria`

**Cambios de esquema:**
- Crear tabla `Categorias` con columnas: `Id` (PK, autoincremental), `Nombre` (TEXT NOT NULL), `Color` (TEXT NOT NULL)
- Añadir columna `CategoriaId` a tabla `TodoItems` (INTEGER NULL)
- Crear índice en `TodoItems.CategoriaId` para mejorar rendimiento de filtros
- Crear FK `TodoItems.CategoriaId` → `Categorias.Id` con `ON DELETE SET NULL`

## 4. DTOs

### DTOs de entrada

```csharp
// Dtos/CategoriasDtos.cs

namespace AppTodoList.Dtos;

// DTO de entrada para crear una categoría
public class CrearCategoriaDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

// DTO de entrada para actualizar una categoría
public class ActualizarCategoriaDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}
```

### DTOs de salida

```csharp
// DTO de salida (respuesta) en Dtos/CategoriasDtos.cs
public class CategoriaDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

// Actualización de TareaDto en Dtos/TareasDtos.cs
// Añadir estas dos propiedades:
public int? CategoriaId { get; set; }
public string? CategoriaNombre { get; set; }
```

## 5. Endpoints

| Verbo | Ruta | Cuerpo | Respuesta exitosa | Errores posibles |
|-------|------|--------|-------------------|-----------------|
| GET | `/api/categorias` | — | 200: `CategoriaDto[]` | — |
| GET | `/api/categorias/{id}` | — | 200: `CategoriaDto` | 404: Categoría no encontrada |
| POST | `/api/categorias` | `CrearCategoriaDto` | 201: `CategoriaDto` + Location header | 400: Validación fallida |
| PUT | `/api/categorias/{id}` | `ActualizarCategoriaDto` | 200: `CategoriaDto` | 404: Categoría no encontrada, 400: Validación fallida |
| DELETE | `/api/categorias/{id}` | — | 204: Sin contenido | 404: Categoría no encontrada, 400: Tiene tareas asociadas |
| GET | `/api/tareas?categoriaId={id}` | — | 200: `TareaDto[]` filtradas | — |

## 6. Lógica de negocio

**Reglas a implementar en `CategoriaLogica`:**

1. **Validación de eliminación:** Al intentar eliminar una categoría, verificar si existen tareas con `CategoriaId` igual al ID recibido. Si existen tareas asociadas, lanzar excepción o devolver error semántico.
   
2. **Validación de formato hex:** Asegurar que el campo `Color` cumpla el patrón `^#[0-9A-Fa-f]{6}$` (opcional en lógica si se implementa en DTO con Data Annotations).

3. **Validación de nombre único:** (opcional, según diseño) Verificar que no exista otra categoría con el mismo nombre al crear/actualizar.

**Modificación en `TodoLogica`:**
- El método `ObtenerTodosAsync()` debe aceptar un parámetro opcional `int? categoriaId` y aplicar filtro `.Where(t => t.CategoriaId == categoriaId)` si el parámetro no es null.

## 7. Capas afectadas

**Crear:**
- `Models/Categoria.cs`
- `Dtos/CategoriasDtos.cs`
- `LogicaNegocio/ICategoriaLogica.cs`
- `LogicaNegocio/CategoriaLogica.cs`
- `Services/ICategoriaService.cs`
- `Services/CategoriaService.cs`
- `Controllers/CategoriasController.cs`

**Modificar:**
- `Models/TodoItem.cs` — añadir `CategoriaId` y `Categoria` (navegación)
- `Dtos/TareasDtos.cs` — añadir `CategoriaId` y `CategoriaNombre` a `TareaDto`
- `Data/AppDbContext.cs` — añadir `DbSet<Categoria>`, configurar relación 1:N y validaciones Fluent API
- `LogicaNegocio/ITodoLogica.cs` — actualizar firma de `ObtenerTodosAsync(int? categoriaId = null)`
- `LogicaNegocio/TodoLogica.cs` — implementar filtrado por categoría
- `Services/ITodoService.cs` — actualizar firma de `ObtenerTodosAsync(int? categoriaId = null)`
- `Services/TodoService.cs` — propagar parámetro y mapear `CategoriaNombre` en el DTO de salida
- `Controllers/TareasController.cs` — añadir query param `[FromQuery] int? categoriaId` en `ObtenerTodos()`
- `Program.cs` — registrar `ICategoriaLogica`, `CategoriaLogica`, `ICategoriaService`, `CategoriaService` en DI

## 8. Tests unitarios a implementar

**Tests para `CategoriaLogica`:**
- `CrearCategoria_DebeAsignarIdYDevolverEntidad`: verifica creación exitosa.
- `EliminarCategoria_ConTareasAsociadas_DebeLanzarExcepcion`: verifica que no se puede eliminar una categoría con tareas.
- `EliminarCategoria_SinTareas_DebeEliminarYRetornarTrue`: verifica eliminación exitosa si no hay tareas.

**Tests para `TodoLogica`:**
- `ObtenerTodos_ConCategoriaId_DebeDevolverSoloTareasDeLaCategoria`: verifica filtrado por categoría.
- `ObtenerTodos_SinCategoriaId_DebeDevolverTodasLasTareas`: verifica comportamiento sin filtro.

**Tests de integración:**
- `FiltrarTareasPorCategoria_DebeRetornar200YListaFiltrada`: verifica endpoint GET `/api/tareas?categoriaId=X` devuelve solo tareas de esa categoría.

## 9. Criterios de aceptación

✅ Migración `AgregarCategoria` aplicada sin errores (`dotnet ef database update`).  
✅ CRUD de categorías funcional: crear, obtener, actualizar, eliminar (sin tareas asociadas).  
✅ Validación implementada: no se puede eliminar categoría con tareas activas (retorna 400).  
✅ Filtrado de tareas por categoría operativo con query param `categoriaId`.  
✅ Tareas existentes sin categoría (`CategoriaId = null`) siguen funcionando correctamente.  
✅ Todos los tests unitarios y de integración pasan (`dotnet test`).

## 10. Skills a invocar

Basándote en las capas afectadas (sección 7), indica qué skills del catálogo de
`docs/skills-orquestacion.md` hay que ejecutar para implementar esta feature y en qué orden.
Respeta siempre la cadena de dependencias definida en ese documento.

> Para ejecutar toda la cadena de una vez, usa el skill orquestador: `nueva-feature`.  
> Para ejecutar skills individuales, llámalos en el orden indicado a continuación.

| Orden | Skill | Motivo (qué genera para esta feature) |
|-------|-------|---------------------------------------|
| 1 | `diseño-analisis` | Actualizar `docs/analisis-diseño.md` con la entidad `Categoria`, relación 1:N con `TodoItem`, y nuevos endpoints del controlador `CategoriasController` |
| 2 | `modelo` | Crear `Models/Categoria.cs` y modificar `Models/TodoItem.cs` añadiendo `CategoriaId` y navegación `Categoria` |
| 3 | `dto` | Crear `Dtos/CategoriasDtos.cs` con `CrearCategoriaDto`, `ActualizarCategoriaDto`, `CategoriaDto`; modificar `TareaDto` para incluir `CategoriaId` y `CategoriaNombre` |
| 4 | `base-de-datos` | Añadir `DbSet<Categoria>` en `AppDbContext`, configurar relación 1:N con Fluent API, añadir validaciones (max length, formato hex), generar migración `AgregarCategoria` |
| 5 | `logica-negocio` | Crear `ICategoriaLogica.cs` y `CategoriaLogica.cs` con CRUD completo + validación de eliminación; modificar `ITodoLogica` y `TodoLogica` para soportar filtrado por `categoriaId` |
| 6 | `validaciones` | Añadir Data Annotations en `CrearCategoriaDto` y `ActualizarCategoriaDto` para validar `Nombre` (requerido, max 100) y `Color` (requerido, regex hex); implementar validación de eliminación en `CategoriaLogica` |
| 7 | `servicio` | Crear `ICategoriaService.cs` y `CategoriaService.cs` con mapeo DTO↔Entidad; modificar `ITodoService` y `TodoService` para propagar parámetro `categoriaId` y mapear `CategoriaNombre` desde la navegación |
| 8 | `controlador` | Crear `CategoriasController.cs` con endpoints GET, GET/{id}, POST, PUT/{id}, DELETE/{id}; modificar `TareasController.GetTodos()` para aceptar query param `categoriaId` |
| 9 | `commit-message` | Generar mensaje de commit siguiendo convenciones del proyecto: `feat: añadir sistema de categorías para tareas con relación 1:N` |

---

## Comandos de EF Core

```bash
# Generar migración
dotnet ef migrations add AgregarCategoria

# Aplicar migración
dotnet ef database update

# Ejecutar tests
dotnet test
```

---

## Checklist de verificación

- [ ] Migración aplicada sin errores y base de datos actualizada
- [ ] CRUD de categorías funciona correctamente (crear, obtener, actualizar, eliminar)
- [ ] Validación de eliminación impide borrar categorías con tareas asociadas
- [ ] Filtrado de tareas por categoría retorna resultados correctos
- [ ] Tareas sin categoría (`CategoriaId = null`) funcionan sin problemas
- [ ] Todos los tests pasan: `dotnet test`
- [ ] Registro de servicios en `Program.cs` completado
