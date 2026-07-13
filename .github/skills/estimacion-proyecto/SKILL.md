---
name: estimacion-proyecto
description: 'Genera una hoja de cálculo Excel profesional con los insights y estimaciones de esfuerzo de un proyecto ASP.NET Core. Produce 5 hojas: Resumen ejecutivo (tarjetas métricas), Estimaciones detalladas por funcionalidad con mín/prob/máx, Agrupación por área con equivalencia en jornadas, Modelo de datos y Endpoints API. Úsalo cuando quieras estimar el tiempo de desarrollo, comparar coste con/sin GitHub Copilot, presentar el alcance del proyecto a un cliente o stakeholder, o documentar el inventario de funcionalidades con su esfuerzo asociado.'
argument-hint: 'Nombre del fichero de salida (opcional, por defecto: docs/insights-proyecto.xlsx)'
---

# Skill: Estimación de Proyecto — Hoja de Cálculo

## Cuándo usar este skill

- El usuario pide "estimar el proyecto", "hacer una hoja de estimaciones", "calcular horas de desarrollo"
- Se quiere comparar el tiempo con y sin GitHub Copilot
- Se necesita documentar el inventario de funcionalidades con esfuerzo por funcionalidad
- Se quiere presentar métricas de ahorro a un cliente o stakeholder

---

## Procedimiento

### Paso 1 — Leer el contexto del proyecto

Leer los siguientes ficheros para entender el proyecto antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — arquitectura, modelos, endpoints
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — stack y convenciones

### Paso 2 — Verificar dependencia Python

```bash
C:\Users\hispa\AppData\Local\Python\bin\python.exe -c "import openpyxl; print(openpyxl.__version__)"
```

Si falla: `pip install openpyxl`

### Paso 3 — Generar el script `docs/generar_xlsx.py`

Crear (o sobreescribir si ya existe) el script `docs/generar_xlsx.py` siguiendo las
especificaciones de estructura de hojas definidas en la **Sección: Estructura del Excel**.

Ejecutarlo al terminar:

```bash
C:\Users\hispa\AppData\Local\Python\bin\python.exe docs/generar_xlsx.py
```

El fichero de salida por defecto es `docs/insights-proyecto.xlsx`.

---

## Estructura del Excel

El workbook debe tener **exactamente 5 hojas** en este orden:

### Hoja 1 — `Resumen`

**Propósito:** Dashboard ejecutivo visible de un vistazo.

**Contenido:**
- Fila 1: Título del proyecto (merge A1:H1, fondo `#1E2761`, texto blanco, 18pt bold)
- Fila 2: Subtítulo con stack (fondo `#2E75B6`, texto blanco, 11pt italic)
- Filas 4-6: **4 tarjetas métricas** en dos columnas (A-B y C-D y E-F y G-H):
  1. Total horas sin Copilot → fórmula `='Estimaciones'!J3`
  2. Total horas con Copilot → fórmula `='Estimaciones'!K3`
  3. Ahorro estimado (h) → fórmula `=A5-C5`
  4. Ahorro (%) → fórmula `=(A5-C5)/A5` con formato `0.0%`
- Filas 8-12: Tabla de **metodología** (qué significa cada estimación, unidades, confianza)

**Reglas de diseño:**
- Las tarjetas deben ser visualmente grandes (valor en 22pt bold, color semáforo)
- Sin gridlines (`ws.sheet_view.showGridLines = False`)

---

### Hoja 2 — `Estimaciones`

**Propósito:** Inventario completo de funcionalidades con esfuerzo por cada una.

**Columnas (en orden):**

| Col | Cabecera | Tipo | Color |
|-----|----------|------|-------|
| A | Área | Texto | — |
| B | Funcionalidad | Texto | — |
| C | Descripción | Texto (wrap) | — |
| D | Complejidad | Texto | Verde/Naranja/Rojo según valor |
| E | Prioridad | Texto | Rojo/Naranja/Gris según valor |
| F | h sin Copilot (mín) | Número | **Azul** (input editable) |
| G | h sin Copilot (prob) | Número | **Azul** (input editable) |
| H | h sin Copilot (máx) | Número | **Azul** (input editable) |
| I | h con Copilot (prob) | Número | **Azul** (input editable) |
| J | Total sin Copilot | Fórmula `=G{row}` | Negro (calculado) |
| K | Total con Copilot | Fórmula `=I{row}` | Negro (calculado) |

**Cabecera de grupo (fila 2):**
- F2:H2 merge → "Sin GitHub Copilot" fondo rojo
- I2:K2 merge → "Con GitHub Copilot" fondo verde

**Fila de totales (última fila de datos + 1):**
- Columnas F-K: `=SUM(F{inicio}:F{fin})` etc.
- **Crítico**: las celdas J3 y K3 deben contener fórmulas que apunten a los totales
  (`=J{total_row}` y `=K{total_row}`) para que el Resumen las pueda referenciar

**Áreas y funcionalidades mínimas a incluir:**

Extraer las funcionalidades del análisis del proyecto. Como mínimo incluir estas áreas:
`Infraestructura`, `Modelos`, `DTOs`, `Lógica Negocio`, `Servicios`, `Controladores`, `Tests`, `Documentación`

**Leyenda al pie:**
- "Azul = inputs editables | Complejidad: Verde=Baja, Naranja=Media, Rojo=Alta | Confianza: ±20%"

**Reglas:**
- `freeze_panes = "A4"` (congelar cabeceras)
- Filas alternas: `#EBF3FB` / `#FFFFFF`
- Altura de fila: 36pt para que el texto largo sea legible

---

### Hoja 3 — `Por Área`

**Propósito:** Resumen agrupado por área con equivalencia en jornadas laborales.

**Columnas:**

| Col | Cabecera |
|-----|----------|
| A | Área |
| B | Funcionalidades (conteo) |
| C | Horas sin Copilot (prob) — input azul |
| D | Horas con Copilot (prob) — input azul |
| E | Ahorro (h) — fórmula `=C{row}-D{row}` |
| F | Ahorro (%) — fórmula `=IF(C{row}>0,(C{row}-D{row})/C{row},0)` |

**Fila de totales:** `=SUM(...)` para C, D, E; `=IF(C>0,(C-D)/C,0)` para F.

**Bloque de equivalencia en jornadas** (debajo de la tabla):
- 1 jornada laboral = 8 horas
- Mostrar en celdas grandes (13pt bold, colores semáforo):
  - "Jornadas sin Copilot" → `=ROUND(C{total}/8, 1)` en rojo
  - "Jornadas con Copilot" → `=ROUND(D{total}/8, 1)` en verde
  - "Jornadas ahorradas" → `=ROUND((C{total}-D{total})/8, 1)` en azul

---

### Hoja 4 — `Modelo de Datos`

**Propósito:** Referencia completa de entidades, campos y relaciones.

**Estructura:** Un bloque por entidad, luego un bloque de relaciones.

**Por cada entidad**, una tabla con columnas:
`Campo | Tipo | Constraint (PK/FK/IX/—) | Nullable | Notas`

**Entidades a incluir** (extraídas del análisis del proyecto):
- Leer `docs/analisis-diseño.md` y generar una tabla por cada entidad del modelo

**Bloque de relaciones:** tabla con:
`Origen | Cardinalidad | Destino | FK | OnDelete`

---

### Hoja 5 — `Endpoints API`

**Propósito:** Inventario completo de endpoints con formato visual por verbo HTTP.

**Columnas:**
`Verbo | Ruta completa | Descripción | Respuesta OK | Error | Notas`

**Color por verbo HTTP** (fondo de la celda Verbo):

| Verbo | Fondo | Texto |
|-------|-------|-------|
| GET | `#61AFFE` | negro |
| POST | `#49CC90` | negro |
| PUT | `#FCA130` | negro |
| DELETE | `#F93E3E` | blanco |

**Estructura:** Un bloque por controlador, con título-sección azul oscuro antes de cada grupo.

**Endpoints a incluir:** extraer de `docs/analisis-diseño.md`, sección 5.

---

## Paleta de colores estándar

```python
C_AZUL_OSC  = "1E2761"   # Títulos de sección, fondo portada
C_AZUL_MED  = "2E75B6"   # Cabeceras de tabla, acentos
C_AZUL_CLAR = "CADCFC"   # Filas pares de tabla
C_AZUL_PAL  = "EBF3FB"   # Filas alternas suaves
C_VERDE     = "00B050"   # Copilot, ahorros, complejidad baja
C_NARANJA   = "FF8C00"   # Complejidad media, advertencias
C_ROJO      = "C00000"   # Sin Copilot, complejidad alta, prioridad alta
C_GRIS_CAB  = "404040"   # Secciones secundarias
C_GRIS_CLAR = "F4F4F4"   # Fondos de tarjeta
C_BLANCO    = "FFFFFF"
```

**Convención de color de texto en celdas de datos:**
- **Azul `#0000FF`**: inputs editables por el usuario (estimaciones en horas)
- **Negro `#000000`**: fórmulas y valores calculados
- **Colores semáforo**: métricas de ahorro y complejidad

---

## Reglas generales del workbook

- Fuente: **Arial** en todo el documento
- Sin gridlines en todas las hojas (`ws.sheet_view.showGridLines = False`)
- Bordes finos (`Side(style="thin", color="CCCCCC")`) en todas las celdas de tabla
- Filas alternas: `C_AZUL_PAL` / `C_BLANCO`
- Cabeceras de tabla: fondo `C_AZUL_MED`, texto blanco, bold
- Títulos de sección: merge de columnas, fondo `C_AZUL_OSC`, texto blanco, 13pt bold
- Cero errores de fórmula (`#REF!`, `#DIV/0!`, etc.)
- Todas las fórmulas con referencias relativas correctas

---

## Fichero de salida

```
docs/insights-proyecto.xlsx
```

Si el fichero ya existe, sobreescribirlo sin pedir confirmación (es un fichero generado).

---

## Ejemplo de invocación

El usuario puede pedir este skill con frases como:
- "genera la hoja de estimaciones del proyecto"
- "quiero un Excel con las horas de desarrollo"
- "crea el fichero de insights del proyecto"
- "genera una estimación con y sin Copilot"
