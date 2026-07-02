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

| Skill | Cuándo usarlo |
|---|---|
| `nueva-feature` | **Orquestador principal.** Implementa cualquier feature nueva de principio a fin (entidad nueva, campo nuevo, endpoint nuevo). Ejecuta todos los skills necesarios en orden. |
| `diseño-analisis` | Crear o regenerar `docs/analisis-diseño.md` |
| `modelo` | Crear o actualizar entidades en `Models/` |
| `dto` | Crear o actualizar DTOs en `Dtos/` |
| `base-de-datos` | Configurar `AppDbContext`, Fluent API y migraciones |
| `logica-negocio` | Crear o actualizar `LogicaNegocio/` |
| `validaciones` | Añadir validaciones a DTOs y lógica |
| `servicio` | Crear o actualizar `Services/` |
| `controlador` | Crear o actualizar `Controllers/` |
| `tests-unitarios` | **Generar pruebas unitarias (primer nivel de la pirámide).** Crea el proyecto xUnit + Moq si no existe, genera tests para Controllers, Services, LogicaNegocio con cobertura de casos normales, edge cases y manejo de errores. Cada feature nueva debe incluir sus tests. |
| `ui-ux-pro-max` | **Consultar ANTES de implementar frontend.** Catálogo de patrones de diseño UI/UX, heurísticas de usabilidad y mejores prácticas. Úsalo para validar diseño de componentes, flujos de usuario, accesibilidad y experiencia antes de escribir código React. |
| `frontend-react` | Crear o actualizar el frontend React + Vite + TypeScript en `frontend/` |
| `github-flow` | **SOLO USADO POR ORQUESTADOR.** Encapsula operaciones GitHub (leer issues, crear ramas, PRs, comentarios). Usado automáticamente cuando invocas `@orquestador issue #N`. |
| `actualizar-documentacion` | **Sincronizar docs con código.** Mantiene actualizada la documentación técnica (`ARQUITECTURA-AGENTES.md`, `skills-orquestacion.md`) cuando cambien agentes, skills o arquitectura. Corrige diagramas Mermaid problemáticos. |
| `commit-message` | Generar el mensaje de commit |
| `estimacion-proyecto` | Generar `docs/insights-proyecto.xlsx` con estimaciones de esfuerzo, comparativa con/sin Copilot, modelo de datos y endpoints |

## Agentes disponibles

| Agente | Cuándo usarlo |
|---|---|
| `@orquestador` | **Ciclo completo de desarrollo.** Coordina planificación → implementación → verificación → commit. Soporta Modo Normal (commit directo) y Modo Issue (crea rama + PR automático). Invocar con `@orquestador <feature>` o `@orquestador issue #N`. |
| `@planificador` | Planificar una feature nueva, generar `docs/plan-*.md` |
| `@desarrollador` | Implementar un plan de `docs/plan-*.md` capa a capa |
| `@verificador` | Verificar que la implementación de un plan es correcta |
| `@generador-tests-unitarios` | **Generar pruebas unitarias (pirámide nivel 1).** Crea proyecto xUnit + Moq si no existe, genera tests para Controllers, Services, LogicaNegocio con patrón AAA. Cubre casos normales, edge cases, validaciones y errores. Ejecuta `dotnet test` antes de reportar. |
| `@auditor-calidad` | **Auditoría completa de calidad:** code smells, deuda técnica, SOLID, seguridad, convenciones. Genera informe markdown + issues de GitHub (si MCP configurado). Modo abogado del diablo. |
| `@documentador-usuario` | **Generar y actualizar documentación de usuario** en docx, pdf o markdown. Analiza el proyecto, detecta cambios, documenta funcionalidades con lenguaje claro y placeholders para capturas. |

## Flujo con GitHub Issues

El orquestador soporta **Modo Issue** para trabajar desde issues de GitHub:

```bash
# Modo Normal (commit directo a rama actual)
@orquestador añadir paginación a tareas

# Modo Issue (crea rama + PR automático)
@orquestador issue #15
@orquestador #15  # también válido
```

**Modo Issue ejecuta:**
1. Lee el issue desde GitHub
2. Crea rama `feature/issue-N-<slug>` desde `main`
3. Ejecuta ciclo completo (planificador → desarrollador → verificador)
4. Commit + push a la rama feature
5. Crea PR hacia `main` con referencia al issue (`Closes #N`)
6. Comenta en el issue con link al PR

**Cuándo usar Modo Issue:**
- Desarrollo en equipo (requiere code review antes de merge)
- Rastrear progreso de auditoría de calidad (vincular cada issue → PR)
- Queremos trazabilidad issue → branch → PR → merge

**Cuándo usar Modo Normal:**
- Desarrollo en solitario con cambios rápidos
- Prototipado sin necesidad de revisión
- Menor overhead (sin ramas ni PRs)

Ver documentación completa en [`docs/ARQUITECTURA-AGENTES.md`](docs/ARQUITECTURA-AGENTES.md) sección 6.5.

---

- **Cada feature nueva lleva su test** — usa `@generador-tests-unitarios` o el skill `tests-unitarios` al terminar la implementación. No crear issues separados para tests.
- Mantener el código simple: si hay una forma más corta de hacer algo, úsala.
- No añadir features no pedidas (sin logging estructurado, sin health checks, sin paginación) a menos que se solicite explícitamente.
- Los snippets de código deben caber en una pantalla de presentación (~30 líneas).
