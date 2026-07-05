---
name: diseño-analisis
description: 'Genera el documento de análisis y diseño completo del proyecto. Úsalo cuando quieras crear o regenerar el análisis de la aplicación, necesites documentar la arquitectura, diseñar los endpoints de la API, definir el modelo de datos, o producir el documento de diseño inicial del proyecto.'
argument-hint: 'Nombre del fichero de salida (opcional, por defecto: docs/analisis-diseño.md)'
---

# Skill: Diseño y Análisis del Proyecto

## Cuándo usar este skill

- El usuario pide "hacer el análisis", "generar el diseño", "crear el documento de análisis"
- Se quiere documentar la arquitectura antes de empezar a codificar
- Se necesita regenerar o actualizar el documento de diseño

## Procedimiento

### Paso 1 — Leer el contexto del proyecto

Leer los siguientes ficheros para entender el proyecto antes de generar nada:

- [`readme.md`](../../readme.md) — objetivos y pasos del proyecto
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — stack, convenciones y modelo de datos

### Paso 2 — Crear el fichero de análisis

Crear el fichero `docs/analisis-diseño.md` (crear la carpeta `docs/` si no existe).

El documento debe incluir las siguientes secciones **en este orden**:

#### 1. Objetivo del proyecto
Descripción en 2-3 frases de qué hace la aplicación y para qué sirve.

#### 2. Stack tecnológico
Tabla con cada tecnología, su versión y la razón de su elección:

| Tecnología | Versión | Rol |
|---|---|---|
| ASP.NET Core | 10 | API REST / backend |
| Entity Framework Core | 10 | ORM / acceso a datos |
| SQLite | — | Base de datos embebida |
| xUnit + Moq | — | Tests unitarios |

#### 3. Arquitectura de capas
Descripción de la arquitectura en capas con su responsabilidad y la estructura de carpetas esperada del proyecto.

#### 4. Modelo de datos
Definición del modelo principal `TodoItem` con todos sus campos, tipos y descripción. Si se identifican entidades adicionales necesarias, incluirlas también.

#### 5. Endpoints API REST
Tabla completa de los endpoints de la API:

| Verbo | Ruta | Descripción | Respuesta OK |
|---|---|---|---|
| GET | /api/tareas | Listar todas las tareas | 200 + array |
| ... | ... | ... | ... |

#### 6. Decisiones de diseño
Lista de las decisiones tomadas y su justificación. Ejemplos:
- Por qué se elige SQLite sobre SQL Server
- Por qué Minimal API o Controllers
- Por qué inyección de dependencias por constructor

#### 7. Pendientes / Preguntas abiertas
Lista de aspectos no definidos aún que requerirán decisión futura (paginación, autenticación, etc.).

### Paso 3 — Confirmar la creación

Informar al usuario de la ruta del fichero generado y hacer un resumen de 3-4 líneas con las decisiones de diseño más relevantes.
