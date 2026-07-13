# Plan: Documentación interactiva de la API con Scalar

> Generado por el agente planificador · 2026-06-25

## 1. Resumen

Integrar Scalar como interfaz moderna de documentación interactiva para la API REST de AppTodoList. Scalar consumirá el esquema OpenAPI existente y proporcionará una experiencia de usuario mejorada frente a Swagger UI tradicional.

## 2. Requisitos funcionales

1. Los desarrolladores deben poder visualizar y probar todos los endpoints de la API desde una interfaz web moderna
2. La documentación debe estar disponible en desarrollo en la ruta `/scalar` o la raíz
3. La interfaz debe consumir el esquema OpenAPI existente sin requerir cambios en los controladores
4. Debe mantener la generación de OpenAPI actual del proyecto
5. Opcionalmente, debe poder habilitarse en producción mediante configuración

## 3. Cambios en el modelo de datos

### Entidades nuevas o modificadas

**N/A** — Esta feature no requiere cambios en el modelo de datos.

### Migración necesaria

**N/A** — No se requiere migración de base de datos.

## 4. DTOs

### DTOs de entrada

**N/A** — Esta feature no requiere DTOs nuevos.

### DTOs de salida

**N/A** — Esta feature no requiere DTOs nuevos.

## 5. Endpoints

**N/A** — Esta feature no añade endpoints nuevos. La documentación consume los endpoints existentes a través del esquema OpenAPI.

| Información | Detalle |
|-------------|---------|
| Ruta de Scalar | `/scalar` (o `/` según configuración) |
| Ruta de OpenAPI | `/openapi/v1.json` (ya existente) |

## 6. Lógica de negocio

**N/A** — Esta feature no requiere lógica de negocio. Es una feature de infraestructura de documentación.

## 7. Capas afectadas

**Crear:**
- Ningún archivo nuevo (solo modificación de archivos existentes)

**Modificar:**
- `AppTodoList.csproj` — añadir referencia al paquete NuGet `Scalar.AspNetCore`
- `Program.cs` — registrar servicios de Scalar y mapear el endpoint de la UI
- `appsettings.json` (opcional) — añadir configuración para habilitar/deshabilitar Scalar por entorno

## 8. Tests unitarios a implementar

**N/A** — Esta feature no requiere tests unitarios específicos. La integración de Scalar es verificable mediante:
- Inspección visual: navegar a `/scalar` y verificar que la UI carga correctamente
- Verificación funcional: probar endpoints desde la interfaz de Scalar

## 9. Criterios de aceptación

✅ El paquete `Scalar.AspNetCore` está instalado en el proyecto

✅ La UI de Scalar es accesible en desarrollo en la ruta configurada (típicamente `/scalar`)

✅ La interfaz muestra todos los endpoints definidos en los controladores existentes:
   - `GET /api/tareas` y sus variantes
   - `GET /api/plantillas` y sus variantes
   - `GET /api/usuarios-asignados` y sus variantes
   - `GET /api/categorias` y sus variantes

✅ Los endpoints son ejecutables desde la interfaz de Scalar (botón "Try it")

✅ La generación de OpenAPI existente (`/openapi/v1.json`) sigue funcionando sin cambios

✅ El proyecto compila sin errores después de la integración

✅ (Opcional) Scalar puede habilitarse/deshabilitarse por entorno mediante configuración

## 10. Skills a invocar

Esta feature es de **infraestructura/documentación**, no de lógica de negocio, por lo que no requiere la cadena estándar de skills del proyecto.

> **Importante:** El skill orquestador `nueva-feature` está diseñado para features de negocio (entidades, endpoints, lógica). Esta feature es más simple y requiere implementación manual directa.

| Orden | Skill | Motivo (qué genera para esta feature) |
|-------|-------|---------------------------------------|
| — | `nueva-feature` | **N/A** — No aplica, feature de infraestructura |
| — | `diseño-analisis` | **N/A** — No hay cambios en modelo de datos ni endpoints de negocio |
| — | `modelo` | **N/A** — No hay entidades nuevas |
| — | `dto` | **N/A** — No hay DTOs nuevos |
| — | `base-de-datos` | **N/A** — No hay cambios en DbContext |
| — | `logica-negocio` | **N/A** — No hay reglas de negocio nuevas |
| — | `validaciones` | **N/A** — No hay validaciones nuevas |
| — | `servicio` | **N/A** — No hay servicios nuevos |
| — | `controlador` | **N/A** — No hay controladores nuevos |
| 1 | `commit-message` | ✅ Generar mensaje de commit al finalizar |

---

## 11. Pasos de implementación manual

Dado que esta feature no encaja en el flujo estándar de skills, se implementa manualmente con los siguientes pasos:

### Paso 1: Instalar el paquete NuGet

```bash
dotnet add package Scalar.AspNetCore
```

### Paso 2: Modificar Program.cs

**Opción A: Ruta `/scalar` (recomendada para convivir con otros endpoints)**

Añadir después de `app.MapOpenApi();` (línea 37):

```csharp
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // Por defecto usa /scalar
}
```

**Opción B: Ruta raíz `/` (solo si no hay frontend en la raíz)**

```csharp
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithEndpointPrefix("/");
    });
}
```

### Paso 3: (Opcional) Habilitar en producción

Si se desea en producción, remover la condición `IsDevelopment()`:

```csharp
app.MapOpenApi();
app.MapScalarApiReference();
```

O usar configuración desde `appsettings.json`:

```json
{
  "FeatureFlags": {
    "EnableApiDocumentation": true
  }
}
```

Y en `Program.cs`:

```csharp
var enableApiDocs = builder.Configuration.GetValue<bool>("FeatureFlags:EnableApiDocumentation");

if (enableApiDocs)
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
```

### Paso 4: Verificar

1. Ejecutar la aplicación: `dotnet run`
2. Navegar a `https://localhost:5001/scalar` (o la ruta configurada)
3. Verificar que todos los endpoints están listados
4. Probar ejecutar un endpoint desde la UI (botón "Try it")

### Paso 5: Commit

Invocar el skill `commit-message` para generar un mensaje siguiendo las convenciones del proyecto.

---

## 12. Notas técnicas

- **Compatibilidad:** Scalar.AspNetCore es compatible con ASP.NET Core 6.0+ (el proyecto usa .NET 10)
- **Esquema OpenAPI:** Scalar consume el mismo esquema que generaría Swagger UI (`/openapi/v1.json`)
- **Sin cambios en controladores:** Los atributos y anotaciones existentes en los controladores son suficientes
- **Alternativa moderna:** Scalar ofrece mejor UX que Swagger UI (diseño moderno, mejor búsqueda, mejor rendering)

---

## 13. Referencias

- [Scalar.AspNetCore en NuGet](https://www.nuget.org/packages/Scalar.AspNetCore)
- [Documentación oficial de Scalar](https://github.com/scalar/scalar)
- [Guía de integración con ASP.NET Core](https://docs.scalar.com/integrations/dotnet)
