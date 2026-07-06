---
name: dto
description: 'Crea o actualiza los DTOs (Data Transfer Objects) de entrada y salida de la API. Úsalo cuando quieras generar los contratos de datos entre la API y los clientes, separar el modelo de dominio de lo que se expone en los endpoints, o sincronizar los DTOs con el documento de análisis y diseño.'
argument-hint: 'Recurso a generar (opcional, por defecto: todos los recursos de la sección 5 del análisis)'
---

# Skill: Crear DTOs (Data Transfer Objects)

## Cuándo usar este skill

- El usuario pide "crear los DTOs", "generar los contratos de datos", "crear la capa de DTOs"
- Se quiere separar el modelo de dominio de lo que se expone en la API
- Se ha modificado el análisis y hay que reflejar los cambios en los DTOs
- Se quiere añadir o eliminar campos de un DTO existente

## Prerequisitos

Antes de usar este skill, deben existir:
1. `docs/analisis-diseño.md` con la sección 4 (modelo) y sección 5 (endpoints) completas. Si no existe, ejecutar primero el skill `diseño-analisis`.
2. Los modelos de dominio en `Models/`. Si no existen, ejecutar primero el skill `modelo`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección 4 (campos del modelo) y sección 5 (campos que entran/salen por cada endpoint)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Los modelos en `Models/` — para conocer los tipos de datos y no repetir campos innecesarios

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar qué DTOs existen

Buscar el fichero `.csproj` del proyecto principal (excluir proyectos de tests). La carpeta `Dtos/` siempre es relativa a ese `.csproj`.

Ubicaciones habituales, en orden de preferencia:
1. `src/<NombreProyecto>/Dtos/` — si hay carpeta `src/`
2. `<NombreProyecto>/Dtos/` — si el proyecto tiene su propia subcarpeta
3. `Dtos/` — si el `.csproj` está en la raíz del repositorio

Una vez localizada la carpeta, comprobar qué ficheros contiene.
Si ya existen DTOs, leer su contenido antes de modificar para evitar sobreescribir cambios manuales.

### Paso 3 — Identificar los DTOs necesarios por recurso

Para cada recurso de la sección 5, generar tres tipos de DTO:

| DTO | Nombre | Cuándo se usa |
|---|---|---|
| Creación (entrada) | `Crear<Recurso>Dto` | Cuerpo del `POST /api/<recurso>` |
| Actualización (entrada) | `Actualizar<Recurso>Dto` | Cuerpo del `PUT /api/<recurso>/{id}` |
| Respuesta (salida) | `<Recurso>Dto` | Cuerpo de las respuestas `200` y `201` |

Si el recurso no tiene endpoint de creación (solo lectura), omitir `Crear<Recurso>Dto`.
Si el recurso no tiene endpoint de actualización, omitir `Actualizar<Recurso>Dto`.

### Paso 4 — Generar los DTOs

Crear los ficheros dentro de `Dtos/`. Se puede agrupar los tres DTOs de un mismo recurso en un único fichero `<Recurso>Dtos.cs`.

#### Reglas de generación

- **Namespace**: derivar del namespace raíz del `.csproj` + `.Dtos`.
- **Solo propiedades públicas**: sin métodos, sin lógica.
- **Valores por defecto**: igual que en los modelos — `string` → `= string.Empty`, bool → `= false`.
- **Sin referencias a entidades de dominio**: los DTOs no incluyen propiedades de tipo `TodoItem` u otras entidades; solo tipos primitivos o enums.
- **Sin claves primarias en DTOs de entrada**: `Id` no se incluye en `Crear<Recurso>Dto` ni en `Actualizar<Recurso>Dto` — el `id` viene por ruta.
- **Campos calculados o de auditoría** (`CreatedAt`, timestamps): no se incluyen en DTOs de entrada; sí en el DTO de respuesta si son relevantes para el cliente.
- **Sin anotaciones de validación**: la validación de dominio va en la lógica de negocio (`LogicaNegocio/`), no en los DTOs. Solo se pueden usar anotaciones de validación básicas de ASP.NET si el análisis las especifica explícitamente.

#### Patrón de ejemplo

```csharp
namespace <Namespace>.Dtos;

// DTO de entrada para crear
public class Crear<Recurso>Dto
{
    public string Titulo { get; set; } = string.Empty;
    // Solo los campos que el cliente puede enviar al crear
}

// DTO de entrada para actualizar
public class Actualizar<Recurso>Dto
{
    public string Titulo { get; set; } = string.Empty;
    // Normalmente los mismos campos que Crear<Recurso>Dto
    // Pueden ser todos opcionales (nullable) si se permiten actualizaciones parciales
}

// DTO de salida (respuesta)
public class <Recurso>Dto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public bool Completado { get; set; } = false;
    public DateTime FechaCreacion { get; set; }
    // Todos los campos que el cliente necesita ver
}
```

### Paso 5 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.

Como siguiente paso sugerir ejecutar el skill `logica-negocio` y luego `servicio`, ya que el servicio necesita los DTOs para el mapeo entre entidades y contratos de API.
