---
name: tests-unitarios
description: 'Crea o actualiza las pruebas unitarias del proyecto (primer nivel de la pirámide de pruebas). Genera el proyecto de tests xUnit + Moq si no existe, y crea tests para Controllers, Services y LogicaNegocio con cobertura de casos normales, edge cases y manejo de errores.'
argument-hint: 'Clase o capa a testear (opcional, por defecto: genera tests para todo lo que no tenga)'
---

# Skill: Generar Pruebas Unitarias (xUnit + Moq)

## Cuándo usar este skill

- El usuario pide "crear tests", "generar pruebas unitarias", "añadir tests"
- Se ha implementado una feature nueva y faltan sus tests
- Se quiere mejorar la cobertura de tests del proyecto
- Se ha modificado código existente y hay que actualizar los tests
- Se necesita configurar el proyecto de tests por primera vez

## Ámbito de este skill

**SOLO pruebas unitarias** — primer nivel de la pirámide:
- ✅ Tests de lógica aislada (Services, LogicaNegocio, métodos auxiliares)
- ✅ Tests de Controllers con mocks de dependencias
- ✅ Casos normales, edge cases, validaciones y manejo de errores
- ❌ Tests de integración (base de datos real, HTTP real)
- ❌ Tests E2E (UI, navegador, flujo completo)

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros para entender la estructura del proyecto:

- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código
- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — casos de uso y reglas de negocio a cubrir
- **Código a testear**: Controllers, Services, LogicaNegocio (según el argumento del usuario)

### Paso 2 — Verificar si existe el proyecto de tests

Buscar en la solución (`.sln`) si hay un proyecto con nombre `*.Tests.csproj` o similar.

Si **no existe**:
1. Preguntar al usuario el nombre que prefiere: `AppTodoList.Tests` (recomendado) o `Tests`
2. Crear el proyecto con `dotnet new xunit`
3. Instalar dependencias:
   ```bash
   dotnet add package Moq
   dotnet add package FluentAssertions
   dotnet add reference ../AppTodoList/AppTodoList.csproj
   ```
4. Añadir el proyecto a la solución:
   ```bash
   dotnet sln add Tests/AppTodoList.Tests.csproj
   ```

Si **ya existe**: verificar que tiene las dependencias necesarias (xUnit, Moq, FluentAssertions). Si faltan, instalarlas.

### Paso 3 — Identificar qué clases testear

Si el usuario especificó una clase o capa concreta (p. ej. "tests para TodoService"), testear solo esa.

Si no especificó, **analizar el código actual** y generar tests para:
1. **Controllers** sin tests (o con cobertura incompleta)
2. **Services** sin tests
3. **LogicaNegocio** sin tests

**Orden de prioridad**: LogicaNegocio → Services → Controllers (de más crítico a menos).

### Paso 4 — Generar los tests

Para cada clase a testear, crear un fichero de tests en la estructura:

```
Tests/
├── Controllers/
│   ├── TareasControllerTests.cs
│   └── CategoriasControllerTests.cs
├── Services/
│   ├── TodoServiceTests.cs
│   └── CategoriaServiceTests.cs
└── LogicaNegocio/
    ├── TodoLogicaTests.cs
    └── CategoriaLogicaTests.cs
```

#### Convenciones de nomenclatura

- **Fichero**: `{ClaseTesteada}Tests.cs`
- **Clase de tests**: `{ClaseTesteada}Tests`
- **Métodos de test**: `{MétodoTesteado}_{Escenario}_{ResultadoEsperado}`

Ejemplos:
- `ObtenerTodas_CuandoHayTareas_DevuelveLista`
- `Crear_ConTituloVacio_LanzaValidationException`
- `Eliminar_ConIdInexistente_DevuelveNull`

#### Estructura de cada test (patrón AAA)

```csharp
[Fact]
public async Task ObtenerPorId_CuandoExiste_DevuelveTarea()
{
    // Arrange
    var mockLogica = new Mock<ITodoLogica>();
    mockLogica.Setup(x => x.ObtenerPorIdAsync(1))
              .ReturnsAsync(new TodoItem { Id = 1, Title = "Test" });
    var service = new TodoService(mockLogica.Object);

    // Act
    var resultado = await service.ObtenerPorIdAsync(1);

    // Assert
    resultado.Should().NotBeNull();
    resultado.Title.Should().Be("Test");
}
```

#### Casos a cubrir SIEMPRE

Para **cada método público**:

1. **Caso feliz** — entrada válida, resultado esperado
2. **Edge cases** — límites, valores extremos, colecciones vacías
3. **Validaciones** — entrada inválida, excepciones esperadas
4. **Null/no encontrado** — cuando aplique (búsqueda por ID inexistente)
5. **Manejo de errores** — excepciones de dependencias propagadas correctamente

#### Reglas de implementación

- **Todo en castellano**: nombres de variables, comentarios, mensajes de assert
- **Async/await**: todos los tests de métodos async deben ser `async Task`
- **Mocks con Moq**: mockear todas las dependencias inyectadas
- **FluentAssertions**: usar `.Should()` en lugar de `Assert.Equal()`
- **Un assert por concepto**: si hay múltiples asserts, que sean del mismo concepto lógico
- **Nombres descriptivos**: el nombre del test debe contar la historia completa
- **No lógica compleja en tests**: si un test necesita un bucle o condicional, dividirlo en varios tests

#### Tests de Controllers

**Mockear**:
- Services inyectados (p. ej. `ITodoService`)
- `HttpContext` si se necesita (usuario autenticado, claims, etc.)

**Verificar**:
- Código de estado HTTP correcto (`200 OK`, `201 Created`, `404 NotFound`, `400 BadRequest`)
- Estructura del objeto devuelto (DTO correcto)
- Llamadas a los services con los parámetros esperados

Ejemplo:
```csharp
[Fact]
public async Task Crear_ConDatosValidos_Devuelve201Created()
{
    // Arrange
    var mockService = new Mock<ITodoService>();
    var controller = new TareasController(mockService.Object);
    var dto = new CrearTareaDto { Title = "Nueva tarea" };

    mockService.Setup(x => x.CrearAsync(dto))
               .ReturnsAsync(new TareaDto { Id = 1, Title = "Nueva tarea" });

    // Act
    var resultado = await controller.Crear(dto);

    // Assert
    resultado.Should().BeOfType<CreatedAtActionResult>();
    var created = resultado as CreatedAtActionResult;
    created.StatusCode.Should().Be(201);
}
```

#### Tests de Services

**Mockear**:
- LogicaNegocio inyectada (p. ej. `ITodoLogica`)
- Cualquier otra dependencia externa

**Verificar**:
- Mapeo correcto entre entidades y DTOs
- Llamadas a la lógica de negocio con parámetros correctos
- Manejo de casos null/no encontrado
- Propagación correcta de excepciones

#### Tests de LogicaNegocio

**Mockear**:
- `AppDbContext` (con `DbContextOptions<AppDbContext>` en memoria, o mock si es complejo)
- Cualquier dependencia externa (servicios, repositorios)

**Verificar**:
- Reglas de negocio aplicadas correctamente
- Validaciones de dominio
- Interacciones con la base de datos (si se usa DbContext en memoria)
- Excepciones de negocio lanzadas en casos inválidos

### Paso 5 — Ejecutar los tests

Compilar y ejecutar los tests para verificar que todo funciona:

```bash
dotnet build Tests/AppTodoList.Tests.csproj
dotnet test Tests/AppTodoList.Tests.csproj
```

**Si fallan tests**:
1. Revisar el código de producción (puede haber un bug real)
2. Ajustar los mocks (puede que el test no refleje el comportamiento real)
3. Corregir el test (puede que la expectativa sea incorrecta)

**No commitear tests que fallen** — el build debe estar en verde.

### Paso 6 — Reportar cobertura (opcional)

Si el usuario lo pide, instalar y ejecutar coverlet:

```bash
dotnet add package coverlet.collector
dotnet test /p:CollectCoverage=true /p:CoverageReportsFormat=lcov
```

Informar al usuario del % de cobertura alcanzado por capa.

### Paso 7 — Confirmar

Informar al usuario:
- Ficheros de tests creados con sus rutas relativas
- Número de tests añadidos por clase
- Resultado de `dotnet test` (todos pasan / X fallidos)
- % de cobertura si se calculó

Si algún test requiere configuración adicional (p. ej. base de datos en memoria, ficheros de configuración para tests), indicarlo explícitamente.

---

## Ejemplos de invocación

```
# Generar todos los tests faltantes
@tests-unitarios

# Tests solo para una clase
@tests-unitarios TodoService

# Tests de toda una capa
@tests-unitarios Services/
@tests-unitarios LogicaNegocio/
```

---

## Notas importantes

- **Tests != documentación**: no escribir tests obvios solo por cobertura. Cada test debe validar un comportamiento específico.
- **Tests frágiles**: evitar dependencias del orden de ejecución, estado compartido, o fechas/horas hardcodeadas.
- **Nomenclatura consistente**: todos los tests del proyecto deben seguir el mismo patrón de nombres.
- **Mocks mínimos**: mockear solo lo necesario. Si algo es trivial (p. ej. un mapper puro), no mockearlo.

---

## Integración con otros skills

Este skill puede ser invocado:
- **Por el planificador**: al generar un plan de feature, puede incluir este skill en la lista
- **Por el desarrollador**: al implementar una feature, debe invocar este skill al final
- **Por el verificador**: puede sugerir añadir tests si la cobertura es baja
- **Por el auditor**: puede reportar falta de tests como hallazgo y recomendar este skill
