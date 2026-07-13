# Plan: Implementar Health Checks

> Generado por el agente planificador · 2026-06-26

## 1. Resumen

Implementar un endpoint `/health` que expone el estado de la aplicación y verifica la conectividad con la base de datos SQLite. Esta feature permite la integración con herramientas de monitoreo (Azure App Service, Kubernetes, Docker) y facilita la detección proactiva de problemas en producción.

## 2. Requisitos funcionales

1. El sistema debe exponer un endpoint GET `/health` accesible sin autenticación
2. El endpoint debe retornar HTTP 200 con status "Healthy" cuando la aplicación y la base de datos están operativas
3. El endpoint debe retornar HTTP 503 con status "Unhealthy" cuando la base de datos no es accesible
4. El endpoint debe incluir detalles del check de base de datos en la respuesta (nombre: "database", status individual)
5. La respuesta debe estar en formato JSON con una estructura legible para herramientas de monitoreo

## 3. Cambios en el modelo de datos

### Entidades nuevas o modificadas

**N/A** — Esta feature no requiere cambios en el modelo de datos. Los health checks son una característica de infraestructura que no persiste información.

### Migración necesaria

**N/A** — No se requiere ninguna migración de base de datos.

## 4. DTOs

### DTOs de entrada

**N/A** — El endpoint `/health` no acepta ningún parámetro de entrada ni cuerpo.

### DTOs de salida

La respuesta será generada automáticamente por el middleware de health checks de ASP.NET Core. Estructura esperada:

```json
{
  "status": "Healthy",
  "totalDuration": "00:00:00.0123456",
  "entries": {
    "database": {
      "data": {},
      "status": "Healthy",
      "duration": "00:00:00.0098765"
    }
  }
}
```

En caso de fallo:

```json
{
  "status": "Unhealthy",
  "totalDuration": "00:00:05.1234567",
  "entries": {
    "database": {
      "data": {},
      "description": "Unable to connect to the database",
      "status": "Unhealthy",
      "duration": "00:00:05.1234567",
      "exception": "..."
    }
  }
}
```

## 5. Endpoints

| Verbo | Ruta | Cuerpo | Respuesta exitosa | Errores posibles |
|-------|------|--------|-------------------|-----------------|
| GET | `/health` | N/A | 200 OK + JSON con `status: "Healthy"` y detalles de checks | 503 Service Unavailable + JSON con `status: "Unhealthy"` cuando la BD no es accesible |

**Nota:** El endpoint es público (no requiere autenticación) para que los orquestadores externos puedan verificar el estado sin credenciales.

## 6. Lógica de negocio

### Reglas de validación

1. **Check de base de datos:**
   - Intentar ejecutar una consulta simple contra el `DbContext` (verificar conectividad)
   - Si la consulta responde en menos de 5 segundos → estado "Healthy"
   - Si la consulta falla o excede el timeout → estado "Unhealthy"

2. **Estado agregado:**
   - Si todos los checks individuales son "Healthy" → estado global "Healthy" (HTTP 200)
   - Si al menos un check es "Unhealthy" → estado global "Unhealthy" (HTTP 503)
   - Si al menos un check es "Degraded" → estado global "Degraded" (HTTP 200 con advertencia)

### Consideraciones de implementación

- Usar el paquete nativo `Microsoft.Extensions.Diagnostics.HealthChecks` (incluido en ASP.NET Core 8)
- Usar el paquete `Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore` para el check de `DbContext`
- Configurar un `ResponseWriter` personalizado para serializar la respuesta en JSON con formato legible

## 7. Capas afectadas

### Archivos a crear

- **N/A** — No se crean archivos nuevos. Toda la configuración se añade a archivos existentes.

### Archivos a modificar

- `Program.cs` — Registrar health checks en el contenedor DI y mapear el endpoint `/health`
- `docs/analisis-diseño.md` — Documentar el nuevo endpoint `/health` en la sección de API
- `Tests/HealthChecksTests.cs` — **Crear archivo nuevo** para los tests de integración del endpoint `/health`

## 8. Tests unitarios a implementar

Crear `Tests/HealthChecksTests.cs` con los siguientes casos:

1. **HealthCheck_ReturnsHealthyWhenDatabaseIsAccessible:**
   - Verifica que GET `/health` retorna HTTP 200 con `status: "Healthy"` cuando la base de datos responde correctamente
   - Verifica que la respuesta incluye el check "database" con estado "Healthy"

2. **HealthCheck_ReturnsUnhealthyWhenDatabaseIsNotAccessible:**
   - Simular fallo de base de datos (usar factory de `WebApplicationFactory` con BD configurada incorrectamente)
   - Verifica que GET `/health` retorna HTTP 503 con `status: "Unhealthy"`
   - Verifica que la respuesta incluye el check "database" con estado "Unhealthy" y un mensaje de error

3. **HealthCheck_IncludesDetailedInformation:**
   - Verifica que la respuesta JSON incluye las propiedades: `status`, `totalDuration`, `entries`
   - Verifica que cada entry tiene: `status`, `duration`, y opcionalmente `data`, `description`, `exception`

4. **HealthCheck_RespondsWithinTimeout:**
   - Verifica que el endpoint responde en menos de 5 segundos (timeout razonable para health checks)

**Nota:** Estos son tests de integración más que unitarios pues prueban el endpoint completo con la base de datos. Se colocarán en el proyecto `Tests/` usando `WebApplicationFactory` de ASP.NET Core.

## 9. Criterios de aceptación

✅ La aplicación compila sin errores ni advertencias  
✅ El endpoint GET `/health` está accesible en `http://localhost:{puerto}/health`  
✅ El endpoint retorna HTTP 200 con JSON `{"status":"Healthy",...}` cuando la base de datos responde  
✅ El endpoint retorna HTTP 503 con JSON `{"status":"Unhealthy",...}` cuando la base de datos no responde (se puede simular deteniendo la app y probando con BD corrupta)  
✅ La respuesta JSON incluye un check llamado "database" con su status individual  
✅ La respuesta JSON es legible y está correctamente formateada (usa `JsonWriterOptions` con indentación)  
✅ Los tests de integración pasan (`dotnet test`)  
✅ El documento `docs/analisis-diseño.md` está actualizado con el endpoint `/health`  
✅ El commit message sigue las convenciones del proyecto  

## 10. Skills a invocar

Basándote en las capas afectadas (sección 7), los skills necesarios son:

> Para ejecutar toda la cadena de una vez, usa el skill orquestador: `nueva-feature`.  
> Para ejecutar skills individuales, llámalos en el orden indicado a continuación.

| Orden | Skill | Motivo (qué genera para esta feature) |
|-------|-------|---------------------------------------|
| 1 | `diseño-analisis` | Actualizar `docs/analisis-diseño.md` para documentar el endpoint `/health` en la sección de API |
| 2 | `modelo` | **N/A** — No hay entidades nuevas ni campos nuevos |
| 3 | `dto` | **N/A** — No hay DTOs de entrada ni salida (el formato de respuesta es generado por el middleware nativo) |
| 4 | `base-de-datos` | **N/A** — No hay cambios en `AppDbContext` ni migraciones |
| 5 | `logica-negocio` | **N/A** — No hay reglas de negocio ni clases de lógica (el health check usa el servicio nativo de EF Core) |
| 6 | `validaciones` | **N/A** — No hay validaciones de entrada (el endpoint no acepta parámetros) |
| 7 | `servicio` | **N/A** — No hay servicios nuevos (el health check usa el servicio nativo `AddDbContextCheck`) |
| 8 | `controlador` | **N/A** — No se crea un controlador. Se usa el endpoint nativo `MapHealthChecks` |
| 9 | `tests-unitarios` | Crear `Tests/HealthChecksTests.cs` con tests de integración para verificar el endpoint `/health` |
| 10 | `ui-ux-pro-max` | **N/A** — Esta feature no tiene interfaz de usuario (es un endpoint de infraestructura) |
| 11 | `frontend-react` | **N/A** — No se requiere componente React para esta feature (aunque opcionalmente se podría añadir un indicador de estado en el futuro) |
| 12 | `commit-message` | Generar mensaje de commit siguiendo convenciones: `feat: implementar health checks con verificación de base de datos` |

---

## Notas de implementación

### Código esperado en `Program.cs`

**Antes de `builder.Build()`:**
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>(name: "database", tags: new[] { "db", "sql" });
```

**Después de configurar middleware (antes de `app.Run()`):**
```csharp
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json; charset=utf-8";
        
        var result = JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            totalDuration = report.TotalDuration.ToString(),
            entries = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                duration = e.Value.Duration.ToString(),
                description = e.Value.Description,
                data = e.Value.Data
            })
        }, new JsonSerializerOptions { WriteIndented = true });
        
        await context.Response.WriteAsync(result);
    }
});
```

**Importaciones necesarias:**
```csharp
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using System.Text.Json;
```

### Paquetes NuGet requeridos

- `Microsoft.Extensions.Diagnostics.HealthChecks` — incluido en ASP.NET Core 8
- `Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore` — **verificar si ya está instalado**, si no: `dotnet add package Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore`

### Estimación de esfuerzo

**5 minutos** — según el issue original. Desglose:
- Añadir configuración en `Program.cs`: 2 minutos
- Crear tests de integración básicos: 2 minutos
- Verificar y documentar: 1 minuto

### Severidad: MEDIA

Esta feature es crítica para entornos de producción (orquestación en k8s, monitoreo en Azure) pero no impacta directamente la funcionalidad de negocio de la aplicación.

---

**Fin del plan de implementación.**
