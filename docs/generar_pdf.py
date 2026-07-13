"""Genera analisis-diseño.pdf usando reportlab."""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

OUTPUT = os.path.join(os.path.dirname(__file__), "analisis-diseño.pdf")

# ── Colores ───────────────────────────────────────────────────────────────────
AZUL      = colors.HexColor("#2E75B6")
AZUL_CLAR = colors.HexColor("#EBF3FB")
AZUL_CAB  = colors.HexColor("#2E75B6")
GRIS_COD  = colors.HexColor("#F4F4F4")
GRIS_BORD = colors.HexColor("#CCCCCC")
BLANCO    = colors.white
NEGRO     = colors.HexColor("#212121")

PAGE_W, PAGE_H = A4
MARGIN = 2.5 * cm
CONTENT_W = PAGE_W - 2 * MARGIN


# ── Estilos ───────────────────────────────────────────────────────────────────
def make_styles():
    base = getSampleStyleSheet()

    def ps(name, **kw):
        return ParagraphStyle(name, **kw)

    styles = {
        "titulo_portada": ps("titulo_portada",
            fontSize=28, fontName="Helvetica-Bold",
            textColor=AZUL, alignment=TA_CENTER, spaceAfter=8),
        "subtitulo_portada": ps("subtitulo_portada",
            fontSize=16, fontName="Helvetica",
            textColor=colors.HexColor("#606060"), alignment=TA_CENTER, spaceAfter=6),
        "fecha_portada": ps("fecha_portada",
            fontSize=11, fontName="Helvetica",
            textColor=colors.HexColor("#909090"), alignment=TA_CENTER, spaceAfter=0),
        "h1": ps("h1",
            fontSize=15, fontName="Helvetica-Bold",
            textColor=AZUL, spaceBefore=18, spaceAfter=6,
            borderPad=0),
        "h2": ps("h2",
            fontSize=12, fontName="Helvetica-Bold",
            textColor=AZUL, spaceBefore=12, spaceAfter=4),
        "normal": ps("normal",
            fontSize=10, fontName="Helvetica",
            textColor=NEGRO, leading=15, spaceAfter=6, alignment=TA_JUSTIFY),
        "bullet": ps("bullet",
            fontSize=10, fontName="Helvetica",
            textColor=NEGRO, leading=15, spaceAfter=4,
            leftIndent=16, firstLineIndent=0, bulletIndent=0),
        "codigo": ps("codigo",
            fontSize=8, fontName="Courier",
            textColor=NEGRO, leading=11, spaceAfter=0,
            leftIndent=8, rightIndent=8,
            backColor=GRIS_COD, borderPad=4),
        "tabla_normal": ps("tabla_normal",
            fontSize=8.5, fontName="Helvetica",
            textColor=NEGRO, leading=12),
        "tabla_cab": ps("tabla_cab",
            fontSize=8.5, fontName="Helvetica-Bold",
            textColor=BLANCO, leading=12),
    }
    return styles


# ── Helpers ───────────────────────────────────────────────────────────────────
def tabla(st, headers, rows, col_widths):
    """Genera una Table con cabecera azul y filas alternas."""
    data = [[Paragraph(h, st["tabla_cab"]) for h in headers]]
    for i, row in enumerate(rows):
        data.append([Paragraph(str(c), st["tabla_normal"]) for c in row])

    col_w = [w * cm for w in col_widths]
    t = Table(data, colWidths=col_w, repeatRows=1)

    row_styles = [
        ("BACKGROUND", (0, 0), (-1, 0), AZUL_CAB),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [AZUL_CLAR, BLANCO]),
        ("GRID",       (0, 0), (-1, -1), 0.5, GRIS_BORD),
        ("VALIGN",     (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING",  (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]
    t.setStyle(TableStyle(row_styles))
    return t


def bloque_codigo(st, code: str):
    """Devuelve lista de flowables para un bloque de código."""
    items = []
    for line in code.strip().splitlines():
        items.append(Paragraph(line.replace(" ", "&nbsp;") if line.strip() == "" else line, st["codigo"]))
    items.append(Spacer(1, 6))
    return items


def h1(st, texto):
    return [
        Paragraph(texto, st["h1"]),
        HRFlowable(width=CONTENT_W, thickness=1.5, color=AZUL, spaceAfter=4),
    ]


def h2(st, texto):
    return [Paragraph(texto, st["h2"])]


# ── Numeración de páginas ─────────────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#909090"))
    canvas.drawRightString(PAGE_W - MARGIN, MARGIN * 0.6,
                           f"Página {doc.page}")
    canvas.drawString(MARGIN, MARGIN * 0.6, "AppTodoList — Análisis y Diseño")
    canvas.restoreState()


# ── Construcción del documento ────────────────────────────────────────────────
def build():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN * 1.2,
    )

    st = make_styles()
    story = []

    # ── Portada ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4 * cm))
    story.append(Paragraph("Análisis y Diseño", st["titulo_portada"]))
    story.append(Paragraph("Lista de Tareas — AppTodoList", st["subtitulo_portada"]))
    story.append(Spacer(1, 0.4 * cm))
    story.append(HRFlowable(width=8 * cm, thickness=2, color=AZUL, hAlign="CENTER", spaceAfter=12))
    story.append(Paragraph("Junio 2026", st["fecha_portada"]))
    story.append(PageBreak())

    # ── 1. Objetivo ────────────────────────────────────────────────────────────
    story += h1(st, "1. Objetivo del proyecto")
    story.append(Paragraph(
        "Aplicación web CRUD de gestión de tareas personales construida como demo didáctica "
        "para el curso de GitHub Copilot. Permite crear, consultar, actualizar y eliminar tareas, "
        "con soporte de <b>plantillas reutilizables</b> y <b>tareas repetitivas</b> con generación "
        "automática de la siguiente ocurrencia al completar. El objetivo prioritario es la claridad "
        "del código sobre la sofisticación arquitectónica.",
        st["normal"]))

    # ── 2. Stack ───────────────────────────────────────────────────────────────
    story += h1(st, "2. Stack tecnológico")
    story.append(tabla(st,
        headers=["Tecnología", "Versión", "Rol"],
        rows=[
            ["ASP.NET Core", "8", "API REST / backend (Controllers)"],
            ["Entity Framework Core", "8", "ORM / acceso a datos"],
            ["SQLite", "—", "Base de datos embebida, sin infraestructura externa"],
            ["xUnit + Moq", "—", "Tests unitarios"],
        ],
        col_widths=[4, 2.5, 9.5]))
    story.append(Spacer(1, 8))

    # ── 3. Arquitectura ────────────────────────────────────────────────────────
    story += h1(st, "3. Arquitectura de capas")
    story.append(Paragraph(
        "Estructura de capas plana y legible en pantalla, sin patrones complejos (sin CQRS ni Mediator).",
        st["normal"]))
    story.append(tabla(st,
        headers=["Capa", "Carpeta", "Responsabilidad"],
        rows=[
            ["Modelos de dominio", "Models/", "Entidades del negocio (TodoItem, PlantillaTarea, TipoRecurrencia)"],
            ["Acceso a datos", "Data/", "DbContext y configuración de EF Core"],
            ["Lógica de negocio", "LogicaNegocio/", "IXxxLogica + XxxLogica — reglas de negocio y acceso a datos"],
            ["Servicios", "Services/", "IXxxService + XxxService — orquestación y mapeo DTO ↔ entidad"],
            ["API / Controladores", "Controllers/", "Orquestación HTTP, sin lógica de negocio"],
            ["Tests", "Tests/", "Proyecto xUnit separado"],
        ],
        col_widths=[3.5, 3.5, 9]))
    story.append(Spacer(1, 8))

    story += h2(st, "Flujo de llamadas")
    story += bloque_codigo(st, "Controller → [DTO] → Service → [Entidad] → LogicaNegocio → DbContext")

    story += h2(st, "Reglas de diseño")
    for regla in [
        "Inyección de dependencias por constructor, nunca <i>new</i> directo de servicios.",
        "async/await en todos los métodos que accedan a base de datos.",
        "Los controladores solo orquestan — sin lógica de negocio dentro de ellos.",
        "Prefijo <b>I</b> para interfaces: ITodoService, IPlantillaService, etc.",
    ]:
        story.append(Paragraph(f"• {regla}", st["bullet"]))
    story.append(Spacer(1, 8))

    # ── 4. Modelo de datos ─────────────────────────────────────────────────────
    story += h1(st, "4. Modelo de datos")

    story += h2(st, "TodoItem")
    story.append(tabla(st,
        headers=["Campo", "Tipo", "Descripción"],
        rows=[
            ["Id", "int", "Clave primaria, autogenerada"],
            ["Title", "string", "Título o descripción de la tarea. Requerido"],
            ["IsCompleted", "bool", "Indica si la tarea está completada. Por defecto false"],
            ["CreatedAt", "DateTime", "Fecha y hora de creación, asignada al crear"],
            ["EsRepetitiva", "bool", "Indica si la tarea se repite automáticamente al completarse"],
            ["Recurrencia", "TipoRecurrencia?", "Periodicidad: Diaria, Semanal o Mensual"],
            ["ProximaFecha", "DateTime?", "Fecha calculada para la siguiente ocurrencia"],
            ["PlantillaId", "int?", "FK opcional a PlantillaTarea"],
            ["UsuarioAsignadoId", "int?", "FK opcional a UsuarioAsignado"],
        ],
        col_widths=[4, 4, 8]))
    story.append(Spacer(1, 4))
    story += bloque_codigo(st, """\
public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool EsRepetitiva { get; set; }
    public TipoRecurrencia? Recurrencia { get; set; }
    public DateTime? ProximaFecha { get; set; }
    public int? PlantillaId { get; set; }
    public PlantillaTarea? Plantilla { get; set; }
    public int? UsuarioAsignadoId { get; set; }
    public UsuarioAsignado? UsuarioAsignado { get; set; }
}""")

    story += h2(st, "UsuarioAsignado")
    story.append(Paragraph(
        "Usuario que puede ser asignado a una o varias tareas. La FK en TodoItem es opcional (SetNull al eliminar el usuario).",
        st["normal"]))
    story.append(tabla(st,
        headers=["Campo", "Tipo", "Descripción"],
        rows=[
            ["Id", "int", "Clave primaria, autogenerada"],
            ["Nombre", "string", "Nombre completo. Requerido, máx. 100 caracteres"],
            ["Email", "string", "Correo electrónico. Requerido, único, máx. 200 caracteres"],
        ],
        col_widths=[4, 4, 8]))
    story.append(Spacer(1, 8))

    story += h2(st, "PlantillaTarea")
    story.append(Paragraph(
        "Plantilla reutilizable desde la que se pueden generar nuevas tareas con valores predefinidos.",
        st["normal"]))
    story.append(tabla(st,
        headers=["Campo", "Tipo", "Descripción"],
        rows=[
            ["Id", "int", "Clave primaria, autogenerada"],
            ["Titulo", "string", "Título por defecto de la tarea generada. Requerido"],
            ["EsRepetitiva", "bool", "Si las tareas generadas serán repetitivas"],
            ["Recurrencia", "TipoRecurrencia?", "Periodicidad por defecto para las tareas generadas"],
        ],
        col_widths=[4, 4, 8]))
    story.append(Spacer(1, 8))

    story += h2(st, "TipoRecurrencia (enum)")
    story += bloque_codigo(st, """\
public enum TipoRecurrencia
{
    Diaria,
    Semanal,
    Mensual
}""")

    # ── 5. Endpoints ───────────────────────────────────────────────────────────
    story += h1(st, "5. Endpoints API REST")

    story += h2(st, "Tareas — /api/tareas")
    story.append(tabla(st,
        headers=["Verbo", "Ruta", "Descripción", "OK", "Error"],
        rows=[
            ["GET",    "/api/tareas",                "Listar todas las tareas",                                    "200", "—"],
            ["GET",    "/api/tareas/{id}",            "Obtener tarea por ID",                                       "200", "404"],
            ["POST",   "/api/tareas",                 "Crear nueva tarea",                                          "201", "400"],
            ["PUT",    "/api/tareas/{id}",            "Actualizar título o estado",                                 "200", "404/400"],
            ["DELETE", "/api/tareas/{id}",            "Eliminar tarea",                                             "204", "404"],
            ["POST",   "/api/tareas/{id}/completar",  "Completar; si es repetitiva genera siguiente ocurrencia",   "200", "404"],
        ],
        col_widths=[1.8, 5, 6.2, 1.5, 1.5]))
    story.append(Spacer(1, 8))

    story += h2(st, "Usuarios asignados — /api/usuariosasignados")
    story.append(tabla(st,
        headers=["Verbo", "Ruta", "Descripción", "OK", "Error"],
        rows=[
            ["GET",    "/api/usuariosasignados",       "Listar todos los usuarios",                    "200", "—"],
            ["GET",    "/api/usuariosasignados/{id}",  "Obtener usuario por ID",                       "200", "404"],
            ["POST",   "/api/usuariosasignados",       "Crear usuario nuevo",                          "201", "400"],
            ["PUT",    "/api/usuariosasignados/{id}",  "Actualizar nombre o email",                    "200", "404/400"],
            ["DELETE", "/api/usuariosasignados/{id}",  "Eliminar (tareas quedan sin usuario asignado)", "204", "404"],
        ],
        col_widths=[1.8, 5, 6.2, 1.5, 1.5]))
    story.append(Spacer(1, 8))

    story += h2(st, "Plantillas — /api/plantillas")
    story.append(tabla(st,
        headers=["Verbo", "Ruta", "Descripción", "OK", "Error"],
        rows=[
            ["GET",    "/api/plantillas",                  "Listar todas las plantillas",              "200", "—"],
            ["GET",    "/api/plantillas/{id}",             "Obtener plantilla por ID",                 "200", "404"],
            ["POST",   "/api/plantillas",                  "Crear nueva plantilla",                    "201", "400"],
            ["PUT",    "/api/plantillas/{id}",             "Actualizar plantilla",                     "200", "404/400"],
            ["DELETE", "/api/plantillas/{id}",             "Eliminar plantilla",                       "204", "404"],
            ["POST",   "/api/plantillas/{id}/instanciar",  "Crear tarea a partir de la plantilla",     "201", "404"],
        ],
        col_widths=[1.8, 5.5, 5.7, 1.5, 1.5]))
    story.append(Spacer(1, 8))

    # ── 6. Datos de ejemplo ────────────────────────────────────────────────────
    story += h1(st, "6. Datos de ejemplo")
    story.append(Paragraph(
        "El seeder se invoca desde Program.cs al arrancar la aplicación y solo inserta datos si la tabla está vacía.",
        st["normal"]))
    story.append(tabla(st,
        headers=["Entidad", "Registros de ejemplo"],
        rows=[
            ["UsuarioAsignado",  "Ana García (ana@demo.com), Carlos López (carlos@demo.com)"],
            ["PlantillaTarea",   '"Revisión semanal" (semanal), "Backup diario" (diaria)'],
            ["TodoItem",         '"Configurar entorno" (completada), "Revisar PR pendientes" (repetitiva semanal, asignada a Ana)'],
        ],
        col_widths=[4, 12]))
    story.append(Spacer(1, 8))

    # ── 7. Decisiones de diseño ────────────────────────────────────────────────
    story += h1(st, "7. Decisiones de diseño")
    decisiones = [
        ("SQLite sobre SQL Server",              "Base de datos embebida, sin instalación ni configuración de servidor. Ideal para demo local y didáctica."),
        ("Controllers sobre Minimal API",        "Los controladores con atributos son más explícitos y fáciles de leer en pantalla durante una presentación."),
        ("Inyección de dependencias",            "Patrón estándar de .NET; desacopla la lógica de negocio y facilita los tests con mocks."),
        ("Interfaz ITodoService",                "Permite sustituir la implementación por un mock en los tests sin tocar el controlador."),
        ("Recurrencia calculada en el servicio", "La lógica de generar la siguiente ocurrencia vive en TodoService.Completar(), no en el controlador ni en el modelo."),
        ("POST /completar en lugar de PUT",      "La acción tiene un efecto secundario (crear nueva ocurrencia), por lo que merece su propio endpoint de acción."),
        ("Plantilla como entidad independiente", "PlantillaTarea es una entidad propia para permitir gestionar y reutilizar plantillas sin acoplarlas a las tareas."),
        ("Sin paginación ni autenticación",      "Fuera del alcance de la demo; añadir solo si se solicita explícitamente."),
        ("Código en castellano",                 "Nombres de clases, métodos y variables en español para coherencia con el público hispanohablante del curso."),
    ]
    for titulo, desc in decisiones:
        story.append(Paragraph(f"• <b>{titulo}:</b> {desc}", st["bullet"]))
    story.append(Spacer(1, 8))

    # ── 8. Pendientes ──────────────────────────────────────────────────────────
    story += h1(st, "8. Pendientes / Preguntas abiertas")
    pendientes = [
        ("Frontend",                         "¿Razor Pages o React + Vite? Pendiente de decisión en el curso."),
        ("Paginación",                       "No incluida. Si el volumen crece, se añadiría skip/take al endpoint GET."),
        ("Autenticación",                    "No incluida. Posible extensión futura con JWT o cookies."),
        ("Filtros y búsqueda",               "Posible extensión: GET /api/tareas?completada=true."),
        ("Soft delete vs hard delete",       "Actualmente se borra físicamente. Podría añadirse campo DeletedAt si se requiere historial."),
        ("Job de recurrencia automática",    "La siguiente ocurrencia se genera solo al llamar a POST /completar. Para generación automática habría que añadir un BackgroundService."),
        ("Recurrencia personalizada",        "El enum cubre Diaria/Semanal/Mensual. Para patrones más complejos habría que extender el modelo."),
        ("Herencia plantilla → tareas",      "Si se modifica una plantilla, las tareas ya creadas no se actualizan. Comportamiento a definir si se requiere propagación."),
    ]
    for titulo, desc in pendientes:
        story.append(Paragraph(f"• <b>{titulo}:</b> {desc}", st["bullet"]))

    # ── Build ──────────────────────────────────────────────────────────────────
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"Documento generado: {OUTPUT}")


if __name__ == "__main__":
    build()
