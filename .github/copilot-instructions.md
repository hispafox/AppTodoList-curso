# AppTodoList — Lista de Tareas ASP.NET Core

Aplicación de lista de tareas para el curso de GitHub Copilot. CRUD construido con ASP.NET Core.

## Stack

- **Backend**: ASP.NET Core 10 Minimal API o Controllers (según decisión del curso)
- **Base de datos**: SQLite con Entity Framework Core
- **Frontend**: Razor Pages o React + Vite (según decisión del curso)
- **Tests**: xUnit + Moq

## Arquitectura

Estructura de capas del proyecto:

```
AppTodoList/
├── Models/          # Entidades de dominio (TodoItem, etc.)
├── Dtos/            # Contratos de entrada/salida de la API
├── Data/            # DbContext y configuración de EF Core
├── LogicaNegocio/   # Reglas de negocio y acceso a datos (IXxxLogica, XxxLogica)
├── Services/        # Orquestación y mapeo DTO ↔ entidad (IXxxService, XxxService)
├── Controllers/     # Endpoints HTTP
└── Tests/           # Proyecto xUnit separado
```

Flujo de llamadas:
```
Controller → [DTO] → Service → [Entidad] → LogicaNegocio → DbContext
```

- No usar patrones complejos (CQRS, mediator) — el objetivo es claridad didáctica.
- Mantener las clases pequeñas y fáciles de leer en pantalla.

## Convenciones de código

- Idioma del código: **castellano** (nombres de clases, métodos, variables).
- Idioma de comentarios y mensajes de UI: **español** (es una demo para hispanohablantes).
- Siempre inyectar dependencias por constructor, nunca `new` directo de servicios.
- Usar `async/await` en todos los métodos que accedan a base de datos.
- Prefijo `I` para interfaces: `ITodoService`.
- Los controladores solo orquestan — sin lógica de negocio dentro de ellos.

## Modelo principal

```csharp
public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

## Build y Tests

```bash
dotnet build
dotnet test
dotnet ef migrations add <Nombre>
dotnet ef database update
```

## Skills disponibles

Índice de los skills del proyecto. Se rellena a medida que se van creando, capítulo a capítulo.

| Skill | Cuándo usarlo |
|---|---|
| `commit-message` | Generar el mensaje de commit |
| `diseño-analisis` | Crear o regenerar `docs/analisis-diseño.md` |
| `modelo` | Generar las clases de dominio en `Models/` leyendo la sección 4 del análisis |
| `controlador` | Generar los controladores en `Controllers/` leyendo la sección 5 del análisis |
| `dto` | Generar los DTOs de entrada/salida en `Dtos/` y refactorizar los controladores para usarlos |
| `servicio` | Generar la capa de orquestación en `Services/` (traduce DTO ↔ entidad y delega en la lógica) |
| `logica-negocio` | Generar la capa de reglas de dominio y acceso a datos en `LogicaNegocio/` (trabaja con entidades, usa `AppDbContext`) |
| `base-de-datos` | Crear `AppDbContext` (EF Core + SQLite), la Fluent API, el registro en `Program.cs`, el seeder, y ejecutar las migraciones |
| `validaciones` | Añadir las validaciones de entrada (DataAnnotations en los DTOs) y las reglas de guarda de dominio en la lógica de negocio |

## Agentes disponibles

Índice de los agentes del proyecto. Igual que el de skills: se rellena cuando se crean.

| Agente | Cuándo usarlo |
|---|---|

---

- **Cada feature nueva lleva su test** — no crear issues separados para tests.
- Mantener el código simple: si hay una forma más corta de hacer algo, úsala.
- No añadir features no pedidas (sin logging estructurado, sin health checks, sin paginación) a menos que se solicite explícitamente.
- Los snippets de código deben caber en una pantalla de presentación (~30 líneas).
