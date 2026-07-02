---
name: commit-message
description: 'Genera mensajes de commit siguiendo convenciones del proyecto. Úsalo cuando vayas a hacer un commit, quieras redactar el mensaje de commit, necesites describir un cambio para git, o preguntes cómo formular un commit.'
argument-hint: 'Describe brevemente el cambio que vas a commitear'
---

# Generador de Mensajes de Commit

## Formato

```
<tipo>[ámbito opcional]: <resumen corto en imperativo>

[cuerpo opcional — explica el porqué si el cambio no es obvio]

[footer(s) opcionales]
```

### Tipos permitidos

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `refactor` | Reestructuración sin cambio de comportamiento |
| `test` | Añadir o corregir tests |
| `chore` | Tareas de mantenimiento (deps, config, build) |
| `style` | Formato, sangría, sin cambio lógico |
| `perf` | Mejora de rendimiento |
| `ci` | Cambios en pipelines / GitHub Actions |
| `revert` | Revierte un commit anterior |

### Ámbito (scope) — opcional

Añade contexto sobre qué parte del código afecta. Va entre paréntesis:

```
feat(TareasController): añadir endpoint DELETE /api/tareas/{id}
fix(TodoService): lanzar 404 cuando el item no existe
test(TodoServiceTests): cubrir caso de título vacío
```

### BREAKING CHANGE

Si el cambio rompe compatibilidad, añade `!` antes de los dos puntos o un footer `BREAKING CHANGE:`:

```
feat(api)!: cambiar respuesta de creación de 200 a 201

BREAKING CHANGE: los clientes que esperan 200 en POST /api/tareas deben actualizarse.
```

## Reglas

### 1. Sé específico — di qué cambió exactamente

❌ `docs: actualizar instrucciones`
✓ `docs: cambiar idioma de ejemplos de código de inglés a castellano`

❌ `fix: corregir error en servicio`
✓ `fix: devolver 404 en TodoService.ObtenerPorId cuando el item no existe`

❌ `chore: actualizar configuración`
✓ `chore: añadir SQLite como proveedor de EF Core en Program.cs`

### 2. Subject: apunta a ~50 chars, límite duro 72

- Objetivo ~50 caracteres: obliga a pensar en lo esencial.
- Límite absoluto: 72 — GitHub trunca con `…` a partir de ahí.
- Imperativo, sin punto final: *"añadir"*, *"corregir"*, *"extraer"* — no *"añadido"* ni *"se añade"*.
- Prueba de imperativo: *"Si se aplica, este commit [subject]"* debe tener sentido.

### 3. El cuerpo explica el PORQUÉ, no el CÓMO

El diff ya muestra cómo cambió el código. El cuerpo debe responder:
- ¿Por qué fue necesario este cambio?
- ¿Qué problema resolvía el estado anterior?
- ¿Qué consecuencias o efectos secundarios tiene?

Envuelve el texto del cuerpo a **72 caracteres** por línea.

### 4. Escueto ≠ vago

Corto está bien. Corto + impreciso no sirve. El lector debe entender qué ocurrió sin abrir el diff.

### 5. Footers — referencias e integraciones

Añade footers al final (separados del cuerpo por línea en blanco) para:

```
Closes: #42
Refs: #38, #41
Reviewed-by: Pedro
```

`Closes:` cierra automáticamente el issue en GitHub al hacer merge.

## Procedimiento

1. Analiza el diff o los archivos modificados.
2. Identifica el tipo de cambio predominante y el ámbito afectado.
3. Escribe el subject: `tipo(ámbito): qué cambió` — apunta a ≤50 chars.
4. Decide si el cuerpo aporta valor. Si sí, explica el porqué (no el cómo), envuelto a 72 chars.
5. Añade footers si hay issues relacionados o es un breaking change.
6. Muestra el mensaje final listo para copiar.

## Ejemplos

```
feat(TareasController): añadir endpoint DELETE /api/tareas/{id}
```

```
fix(TodoService): lanzar KeyNotFoundException cuando Id no existe

Antes devolvía null silenciosamente. Los controladores esperan
la excepción para responder con 404 correctamente.
```
