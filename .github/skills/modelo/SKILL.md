---
name: modelo
description: 'Crea o actualiza los modelos de dominio de la aplicación y los elementos relacionados (DTOs, ViewModels, DbContext, migraciones). Úsalo cuando quieras generar o regenerar las entidades del proyecto, actualizar campos del modelo, o sincronizar el código con el documento de análisis y diseño.'
argument-hint: 'Modelo a crear o actualizar (opcional, por defecto: todos los modelos del análisis)'
---

# Skill: Crear y Actualizar el Modelo de la Aplicación

## Cuándo usar este skill

- El usuario pide "crear el modelo", "generar las entidades", "actualizar el modelo"
- Se quiere sincronizar las clases de dominio con el documento de análisis
- Se ha modificado el análisis y hay que reflejar los cambios en el código
- Se quiere añadir o eliminar campos de una entidad existente
- Se ha cambiado un campo y hay que propagar el cambio a DTOs, ViewModels, DbContext o migraciones

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — fuente de verdad del modelo de datos (sección 4)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar si ya existen los modelos

Buscar el fichero `.csproj` del proyecto principal (excluir proyectos de tests). La carpeta `Models/` siempre es relativa a ese `.csproj`, no a la raíz del repositorio.

Ubicaciones habituales, en orden de preferencia:
1. `src/<NombreProyecto>/Models/` — si hay carpeta `src/`
2. `<NombreProyecto>/Models/` — si el proyecto tiene su propia subcarpeta
3. `Models/` — si el `.csproj` está en la raíz del repositorio

Una vez localizada la carpeta correcta, comprobar qué ficheros contiene.  
Si ya existen modelos, leer su contenido antes de modificar para evitar sobreescribir cambios manuales.

### Paso 3 — Crear o actualizar los modelos

Crear la carpeta `Models/` si no existe. Generar o actualizar **cada entidad** definida en la sección 4 del análisis.

#### Reglas de generación

- **Namespace**: `AppTodoList.Models`
- **Idioma**: nombres de clases, propiedades y métodos en **castellano**, excepto las propiedades que el análisis defina explícitamente en inglés (`Id`, `Title`, `IsCompleted`, `CreatedAt`).
- **Valores por defecto**: asignar siempre valores por defecto a las propiedades para evitar warnings de nullability:
  - `string` → `= string.Empty`
  - `bool` → `= false`
  - Tipos nullable (`int?`, `DateTime?`, enum nullable) → sin valor por defecto (ya son nullable)
- **Claves primarias**: propiedad `Id` de tipo `int`, autogenerada por EF Core.
- **Relaciones de navegación**: incluirlas como propiedades nullable con el tipo de la entidad relacionada.
- **Sin anotaciones de datos** (`[Required]`, `[MaxLength]`…): las restricciones se configuran en `AppDbContext` con Fluent API, no en el modelo.
- **Sin lógica de negocio** en las entidades: solo propiedades, sin métodos.
- **Enums** en fichero propio dentro de `Models/`.

#### Entidades a generar

Extraer la lista completa de entidades y sus campos de la **sección 4 del análisis** (`docs/analisis-diseño.md`). Esa sección es la única fuente de verdad — no inferir ni añadir campos que no estén definidos ahí.

Respetar el orden de generación según dependencias: los enums primero, luego las entidades sin FK, por último las entidades que referencian a otras.

### Paso 4 — Propagar cambios a elementos relacionados (solo si ya existen)

Comprobar qué elementos relacionados existen en el proyecto. **Si ninguno existe, omitir este paso por completo** y pasar directamente al Paso 5.

Solo actuar sobre los elementos que ya estén presentes en el código. No crear DTOs, ViewModels ni configuración de DbContext si no existían antes.

#### DTOs (`Dtos/` o `Models/Dtos/`)

Si existen DTOs:
- Añadir o eliminar las propiedades que correspondan al cambio del modelo.
- No incluir propiedades de navegación ni claves foráneas internas: los DTOs exponen solo los datos necesarios para la API.

#### DbContext (`Data/AppDbContext.cs`)

Si el fichero existe:
- Añadir el `DbSet<T>` de la nueva entidad si no estuviera.
- Actualizar la configuración Fluent API en `OnModelCreating` para reflejar los cambios.

#### Migraciones

Si existe la carpeta `Migrations/` (EF Core ya está configurado):
- **No crear la migración automáticamente.** Indicar al usuario el comando exacto a ejecutar:
  ```
  dotnet ef migrations add <NombreDescriptivo>
  dotnet ef database update
  ```

### Paso 5 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.  
Si algún campo del análisis y el código existente difieren, señalarlo explícitamente para que el usuario decida.  
Si hay migraciones pendientes, recordarlo al final con el comando listo para copiar.
