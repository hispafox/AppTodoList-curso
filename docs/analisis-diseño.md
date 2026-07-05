# Análisis y Diseño — Lista de Tareas

## 1. Objetivo del proyecto

Aplicación web CRUD de gestión de tareas personales construida como demo didáctica para el curso de GitHub Copilot.
Permite crear, consultar, actualizar y eliminar tareas, con soporte de **plantillas reutilizables** y **tareas repetitivas** con generación automática de la siguiente ocurrencia al completar.
El objetivo prioritario es la claridad del código sobre la sofisticación arquitectónica.

---

## 2. Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| ASP.NET Core | 10 | API REST / backend (Controllers) |
| Entity Framework Core | 10 | ORM / acceso a datos |
| SQLite | — | Base de datos embebida, sin infraestructura externa |
| xUnit + Moq | — | Tests unitarios |

---

## 3. Arquitectura de capas

Estructura de capas plana y legible en pantalla, sin patrones complejos (sin CQRS ni Mediator).

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Modelos de dominio | `Models/` | Entidades del negocio (`TodoItem`, `PlantillaTarea`, `TipoRecurrencia`) |
| Acceso a datos | `Data/` | `DbContext` y configuración de EF Core |
| Lógica de negocio | `Services/` | `ITodoService` + `TodoService`, `IPlantillaService` + `PlantillaService` |
| API / Controladores | `Controllers/` | Orquestación HTTP, sin lógica de negocio |
| Tests | `Tests/` | Proyecto xUnit separado |

```
AppTodoList/
├── Models/
│   ├── TodoItem.cs
│   ├── PlantillaTarea.cs
│   └── TipoRecurrencia.cs
├── Data/
│   └── AppDbContext.cs
├── Services/
│   ├── ITodoService.cs
│   ├── TodoService.cs
│   ├── IPlantillaService.cs
│   └── PlantillaService.cs
├── Controllers/
│   ├── TareasController.cs
│   └── PlantillasController.cs
├── Tests/
├── Program.cs
└── appsettings.json
```

**Reglas de diseño:**
- Inyección de dependencias por constructor, nunca `new` directo de servicios.
- `async/await` en todos los métodos que accedan a base de datos.
- Los controladores solo orquestan — sin lógica de negocio dentro de ellos.

---

## 4. Modelo de datos

### `TodoItem`

| Campo | Tipo | Descripción |
|---|---|---|
| `Id` | `int` | Clave primaria, autogenerada |
| `Title` | `string` | Título o descripción de la tarea. Requerido |
| `IsCompleted` | `bool` | Indica si la tarea está completada. Por defecto `false` |
| `CreatedAt` | `DateTime` | Fecha y hora de creación, asignada al crear |
| `EsRepetitiva` | `bool` | Indica si la tarea se repite automáticamente al completarse |
| `Recurrencia` | `TipoRecurrencia?` | Periodicidad: `Diaria`, `Semanal` o `Mensual`. `null` si no es repetitiva |
| `ProximaFecha` | `DateTime?` | Fecha calculada para la siguiente ocurrencia. `null` si no es repetitiva |
| `PlantillaId` | `int?` | FK opcional a `PlantillaTarea` si la tarea se originó de una plantilla |

```csharp
public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool EsRepetitiva { get; set; }
    public TipoRecurrencia? Recurrencia { get; set; }
    public DateTime? ProximaFecha { get; set; }
    public int? PlantillaId { get; set; }
    public PlantillaTarea? Plantilla { get; set; }
}
```

---

### `PlantillaTarea`

Plantilla reutilizable desde la que se pueden generar nuevas tareas con valores predefinidos.

| Campo | Tipo | Descripción |
|---|---|---|
| `Id` | `int` | Clave primaria, autogenerada |
| `Titulo` | `string` | Título por defecto de la tarea generada. Requerido |
| `EsRepetitiva` | `bool` | Si las tareas generadas desde esta plantilla serán repetitivas |
| `Recurrencia` | `TipoRecurrencia?` | Periodicidad por defecto para las tareas generadas |

```csharp
public class PlantillaTarea
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public bool EsRepetitiva { get; set; }
    public TipoRecurrencia? Recurrencia { get; set; }
}
```

---

### `TipoRecurrencia` (enum)

```csharp
public enum TipoRecurrencia
{
    Diaria,
    Semanal,
    Mensual
}
```

---

## 5. Endpoints API REST

### Tareas — `/api/tareas`

| Verbo | Ruta | Descripción | Respuesta OK | Error |
|---|---|---|---|---|
| GET | `/api/tareas` | Listar todas las tareas | `200` + array de `TodoItem` | — |
| GET | `/api/tareas/{id}` | Obtener una tarea por ID | `200` + `TodoItem` | `404` si no existe |
| POST | `/api/tareas` | Crear una nueva tarea | `201` + `TodoItem` creado | `400` si datos inválidos |
| PUT | `/api/tareas/{id}` | Actualizar título o estado | `200` + `TodoItem` actualizado | `404` / `400` |
| DELETE | `/api/tareas/{id}` | Eliminar una tarea | `204 No Content` | `404` si no existe |
| POST | `/api/tareas/{id}/completar` | Marcar como completada; si es repetitiva, genera la siguiente ocurrencia automáticamente | `200` + `TodoItem` (o nueva ocurrencia) | `404` si no existe |

### Plantillas — `/api/plantillas`

| Verbo | Ruta | Descripción | Respuesta OK | Error |
|---|---|---|---|---|
| GET | `/api/plantillas` | Listar todas las plantillas | `200` + array de `PlantillaTarea` | — |
| GET | `/api/plantillas/{id}` | Obtener una plantilla por ID | `200` + `PlantillaTarea` | `404` si no existe |
| POST | `/api/plantillas` | Crear una nueva plantilla | `201` + `PlantillaTarea` creada | `400` si datos inválidos |
| PUT | `/api/plantillas/{id}` | Actualizar una plantilla | `200` + `PlantillaTarea` actualizada | `404` / `400` |
| DELETE | `/api/plantillas/{id}` | Eliminar una plantilla | `204 No Content` | `404` si no existe |
| POST | `/api/plantillas/{id}/instanciar` | Crear una tarea nueva a partir de la plantilla | `201` + `TodoItem` creado | `404` si plantilla no existe |

---

## 6. Decisiones de diseño

- **SQLite sobre SQL Server**: base de datos embebida, sin instalación ni configuración de servidor. Ideal para una demo local y didáctica.
- **Controllers sobre Minimal API**: los controladores con atributos son más explícitos y fáciles de leer en pantalla durante una presentación.
- **Inyección de dependencias por constructor**: patrón estándar de .NET; desacopla la lógica de negocio y facilita los tests con mocks.
- **Interfaz `ITodoService`**: permite sustituir la implementación por un mock en los tests sin tocar el controlador.
- **Recurrencia calculada en el servicio**: la lógica de generar la siguiente ocurrencia está en `TodoService.Completar()`, no en el controlador ni en el modelo.
- **`POST /completar` en lugar de `PUT` para completar**: la acción de completar una tarea repetitiva tiene un efecto secundario (crear nueva ocurrencia), por lo que merece su propio endpoint de acción en lugar de un `PUT` genérico.
- **Plantilla como entidad independiente**: `PlantillaTarea` es una entidad propia, no un campo de `TodoItem`, para permitir gestionar y reutilizar plantillas sin acoplarlas al ciclo de vida de las tareas.
- **Relación opcional `TodoItem → PlantillaTarea`**: la FK `PlantillaId` es nullable; las tareas creadas manualmente no necesitan plantilla.
- **Sin paginación ni autenticación**: fuera del alcance de la demo; añadir solo si se solicita explícitamente.
- **Código en castellano**: nombres de clases, métodos y variables en español para coherencia con el público hispanohablante del curso.

---

## 7. Pendientes / Preguntas abiertas

- **Frontend**: ¿Razor Pages o React + Vite? Pendiente de decisión en el curso.
- **Paginación**: no incluida. Si el volumen de tareas crece, se añadiría `skip/take` al endpoint GET.
- **Autenticación**: no incluida. Posible extensión futura con JWT o cookies.
- **Filtros y búsqueda**: no incluidos. Posible extensión: `GET /api/tareas?completada=true`.
- **Soft delete vs hard delete**: actualmente se borra físicamente. Podría añadirse campo `DeletedAt` si se requiere historial.
- **Job de recurrencia automática**: actualmente la siguiente ocurrencia se genera solo al llamar a `POST /completar`. Si se requiere generación automática sin intervención del usuario (p. ej. a medianoche), habría que añadir un `BackgroundService` o un job programado.
- **Recurrencia personalizada**: el enum `TipoRecurrencia` cubre los casos más comunes (Diaria/Semanal/Mensual). Si se necesitan patrones más complejos (cada N días, ciertos días de la semana), habría que extender el modelo.
- **Herencia de cambios plantilla → tareas**: si se modifica una plantilla, las tareas ya creadas no se actualizan automáticamente. Comportamiento a definir si se requiere propagación.
