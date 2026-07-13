const { Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber, AlignmentType, 
        HeadingLevel, TabStopType, TabStopPosition, LevelFormat, TableOfContents,
        PageBreak, BorderStyle } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 24 } } // 12pt default
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 280, after: 180 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 2 }
      },
      {
        id: "Heading4",
        name: "Heading 4",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 3 }
      },
      {
        id: "Placeholder",
        name: "Placeholder",
        basedOn: "Normal",
        quickFormat: true,
        run: { italics: true, color: "888888", size: 22 },
        paragraph: { 
          spacing: { before: 160, after: 160 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 1 },
            left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 1 },
            right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 1 }
          },
          shading: { fill: "F5F5F5" }
        }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "◦",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
          }
        ]
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [
    // Portada
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        // Espacio superior
        new Paragraph({ children: [new TextRun("")], spacing: { after: 2880 } }),
        
        // Título principal
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
          children: [
            new TextRun({
              text: "Manual de Usuario",
              size: 56,
              bold: true,
              font: "Arial",
              color: "2E75B6"
            })
          ]
        }),
        
        // Subtítulo
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: "Lista de Tareas — AppTodoList",
              size: 36,
              font: "Arial",
              color: "666666"
            })
          ]
        }),
        
        // Línea separadora
        new Paragraph({
          spacing: { before: 240, after: 240 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 }
          },
          children: [new TextRun("")]
        }),
        
        // Versión
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: "Versión 2.0",
              size: 28,
              font: "Arial",
              color: "333333"
            })
          ]
        }),
        
        // Fecha
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: "26 de junio de 2026",
              size: 24,
              font: "Arial",
              color: "666666"
            })
          ]
        }),
        
        // Salto de página
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    
    // Contenido principal
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Manual de Usuario — Lista de Tareas",
                  size: 20,
                  color: "666666"
                })
              ],
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 1 }
              },
              spacing: { after: 120 }
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Página ", size: 20, color: "666666" }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  size: 20,
                  color: "666666"
                })
              ],
              border: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 1 }
              },
              spacing: { before: 120 }
            })
          ]
        })
      },
      children: [
        // Tabla de contenidos
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Tabla de Contenidos")]
        }),
        new TableOfContents("Tabla de Contenidos", {
          hyperlink: true,
          headingStyleRange: "1-3"
        }),
        new Paragraph({ children: [new PageBreak()] }),
        
        // 1. Introducción
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("1. Introducción")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("¿Qué es esta aplicación?")]
        }),
        new Paragraph({
          children: [new TextRun("Lista de Tareas es una aplicación web que te permite organizar y gestionar tus tareas pendientes de forma simple y efectiva. Podrás crear tareas, asignarlas a usuarios, clasificarlas por categorías, y configurar tareas que se repiten automáticamente.")],
          spacing: { after: 240 }
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("¿Para quién es?")]
        }),
        new Paragraph({
          children: [new TextRun("Esta aplicación está diseñada para cualquier persona o equipo que necesite:")],
          spacing: { after: 120 }
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Llevar un registro de tareas pendientes")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Organizar el trabajo por categorías (Trabajo, Personal, Urgente, etc.)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Asignar tareas a miembros del equipo")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Automatizar tareas recurrentes (reuniones semanales, backups diarios, etc.)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("¿Qué puedes hacer con ella?")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Crear y gestionar tareas", bold: true }), new TextRun(": añade nuevas tareas, edita su contenido, marca como completadas o elimínalas")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Organizar con categorías", bold: true }), new TextRun(": agrupa tus tareas por temas con colores visuales")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Asignar responsables", bold: true }), new TextRun(": vincula tareas a usuarios específicos")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Automatizar repeticiones", bold: true }), new TextRun(": crea tareas que se regeneran automáticamente al completarse (diarias, semanales o mensuales)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Usar plantillas", bold: true }), new TextRun(": guarda configuraciones de tareas frecuentes para crearlas rápidamente")]
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 2. Primeros pasos
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("2. Primeros pasos")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("Acceder a la aplicación")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Abre tu navegador web (Chrome, Firefox, Edge, Safari)")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Introduce la dirección: http://localhost:5173 (en desarrollo) o la URL proporcionada por tu administrador")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("La aplicación cargará la pantalla principal con el listado de tareas")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de pantalla de la página principal de la aplicación\n(Mostrar: barra de navegación superior, lista de tareas, botones de acción principales)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("Navegación básica")]
        }),
        new Paragraph({
          children: [new TextRun("La aplicación cuenta con cuatro secciones principales, accesibles desde el menú superior:")],
          spacing: { after: 120 }
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Tareas", bold: true }), new TextRun(": gestión completa de tus tareas pendientes y completadas")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Categorías", bold: true }), new TextRun(": crea y gestiona las categorías para organizar tus tareas")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Plantillas", bold: true }), new TextRun(": define plantillas reutilizables para crear tareas rápidamente")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Usuarios", bold: true }), new TextRun(": administra la lista de usuarios que pueden ser asignados a tareas")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de pantalla del menú de navegación\n(Incluir: menú superior con las 4 secciones resaltadas)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("Interfaz principal")]
        }),
        new Paragraph({
          children: [new TextRun("Cada sección sigue la misma estructura:")],
          spacing: { after: 120 }
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Listado", bold: true }), new TextRun(": tabla o lista con todos los elementos")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Botón \"Nuevo\"", bold: true }), new TextRun(": crea un nuevo elemento")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Acciones por elemento", bold: true }), new TextRun(": editar, eliminar, o acciones específicas (completar, instanciar, etc.)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Filtros", bold: true }), new TextRun(" (si están disponibles): opciones para filtrar la lista")]
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 3. Gestión de Tareas
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("3. Gestión de Tareas")]
        }),
        new Paragraph({
          children: [new TextRun("Las tareas son el elemento central de la aplicación. Cada tarea tiene un título, un estado (pendiente o completada), fecha de creación, y puede tener categoría, usuario asignado, y configuración de repetición.")],
          spacing: { after: 240 }
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("3.1. Ver todas las tareas")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Tareas\" en el menú superior")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Verás un listado con todas las tareas existentes")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Cada tarea muestra:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Título")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Estado (pendiente o completada)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Categoría asignada (con su color)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Usuario asignado (si lo tiene)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Fecha de creación")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Tipo de recurrencia (si es repetitiva)")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de pantalla de la lista de tareas\n(Mostrar: tabla con varias tareas, algunas completadas, con categorías de colores, usuarios asignados)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("3.2. Crear una tarea nueva")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En la página de Tareas, haz clic en el botón \"Nueva Tarea\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se abrirá un formulario con los siguientes campos:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Título", bold: true }), new TextRun(" (obligatorio): escribe el nombre de la tarea")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Categoría", bold: true }), new TextRun(" (opcional): selecciona una categoría del desplegable")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Usuario asignado", bold: true }), new TextRun(" (opcional): selecciona un usuario responsable")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "¿Es repetitiva?", bold: true }), new TextRun(": marca esta casilla si quieres que la tarea se repita automáticamente")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Recurrencia", bold: true }), new TextRun(" (si es repetitiva): selecciona Diaria, Semanal o Mensual")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("La tarea aparecerá en el listado principal")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de pantalla del formulario de creación de tareas\n(Incluir: todos los campos visibles, casilla de repetitiva sin marcar, desplegables de categoría y usuario)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun("Ejemplo: Crear una tarea simple")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Nueva Tarea\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Introduce el título: \"Revisar correo electrónico\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Selecciona categoría: \"Trabajo\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Deja sin marcar \"Es repetitiva\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario completado con el ejemplo")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun("Ejemplo: Crear una tarea recurrente semanal")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Nueva Tarea\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Introduce el título: \"Reunión de equipo\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Selecciona categoría: \"Trabajo\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Selecciona usuario: \"Ana García\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Marca la casilla \"Es repetitiva\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Selecciona recurrencia: \"Semanal\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario con tarea repetitiva configurada\n(Mostrar: casilla marcada, desplegable de recurrencia visible con \"Semanal\" seleccionado)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("3.3. Editar una tarea")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de tareas, busca la tarea que quieres modificar")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Editar\" (icono de lápiz)")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se abrirá el formulario de edición con los datos actuales de la tarea")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Modifica los campos que necesites: Título, Categoría, Usuario asignado, Estado (pendiente/completada), Configuración de repetición")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Los cambios se reflejarán inmediatamente en el listado")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de pantalla del formulario de edición\n(Mostrar: formulario con datos precargados, campos modificables, botón \"Guardar\")")]
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("3.4. Marcar una tarea como completada")]
        }),
        new Paragraph({
          children: [new TextRun("Hay dos formas de completar una tarea:")],
          spacing: { after: 120 }
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun("Opción A: Usar el botón \"Completar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de tareas, localiza la tarea pendiente")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Completar\" (icono de check o marca de verificación)")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("La tarea se marcará como completada")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Si la tarea es repetitiva", bold: true }), new TextRun(", se creará automáticamente una nueva ocurrencia con la fecha calculada según la recurrencia:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Diaria", bold: true }), new TextRun(": nueva tarea para mañana")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Semanal", bold: true }), new TextRun(": nueva tarea dentro de 7 días")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Mensual", bold: true }), new TextRun(": nueva tarea dentro de 30 días")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura mostrando tarea antes y después de completar\n(Mostrar: estado pendiente → estado completado, y si es repetitiva, nueva tarea generada)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun("Opción B: Editar y cambiar el estado")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Editar\" en la tarea")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Marca la casilla \"Completada\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📊 PLACEHOLDER: Infografía del flujo de tareas repetitivas\n(Diagrama: Tarea repetitiva pendiente → Completar → Tarea marcada completada + Nueva tarea generada automáticamente)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("3.5. Filtrar tareas por categoría")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En la página de Tareas, localiza el selector de \"Filtrar por categoría\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Selecciona una categoría del desplegable")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("La lista mostrará solo las tareas de esa categoría")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Para ver todas las tareas de nuevo, selecciona \"Todas las categorías\" o la opción por defecto")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del filtro de categorías en acción\n(Mostrar: desplegable de categorías, lista filtrada con tareas de una sola categoría)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("3.6. Eliminar una tarea")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de tareas, localiza la tarea que quieres eliminar")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Eliminar\" (icono de papelera)")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se mostrará un diálogo de confirmación: \"¿Estás seguro de que quieres eliminar esta tarea?\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Confirmar\" para eliminarla definitivamente, o en \"Cancelar\" para mantenerla")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("La tarea desaparecerá del listado")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del diálogo de confirmación de eliminación\n(Mostrar: modal con mensaje, botones Confirmar y Cancelar)")]
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 4. Gestión de Categorías
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("4. Gestión de Categorías")]
        }),
        new Paragraph({
          children: [new TextRun("Las categorías te permiten organizar y agrupar tareas por tema, proyecto o prioridad. Cada categoría tiene un nombre y un color visual que ayuda a identificarlas rápidamente.")],
          spacing: { after: 240 }
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("4.1. Ver todas las categorías")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Categorías\" en el menú superior")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Verás un listado con todas las categorías creadas")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Cada categoría muestra: Nombre y Color (representado visualmente)")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de pantalla de la lista de categorías\n(Mostrar: lista con al menos 3 categorías, colores visibles - Trabajo #FF5733, Personal #33C4FF, Urgente #FF3333)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("4.2. Crear una categoría nueva")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En la página de Categorías, haz clic en \"Nueva Categoría\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se abrirá un formulario con los siguientes campos:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Nombre", bold: true }), new TextRun(" (obligatorio): escribe el nombre de la categoría")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Color", bold: true }), new TextRun(" (obligatorio): selecciona un color usando el selector visual o introduce un código hexadecimal (ejemplo: #FF5733)")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("La categoría aparecerá en el listado y estará disponible para asignar a tareas")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de pantalla del formulario de creación de categorías\n(Incluir: campo de nombre, selector de color visual)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun("Ejemplo: Crear una categoría \"Urgente\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Nueva Categoría\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Introduce el nombre: \"Urgente\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Selecciona un color rojo: #FF3333")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario completado con el ejemplo")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("4.3. Editar una categoría")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de categorías, localiza la que quieres modificar")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Editar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Modifica el nombre o el color")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Los cambios se aplicarán a todas las tareas que tengan esta categoría asignada")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario de edición de categorías")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("4.4. Eliminar una categoría")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de categorías, localiza la que quieres eliminar")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Eliminar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Importante", bold: true }), new TextRun(": no podrás eliminar una categoría que tenga tareas asociadas activas")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Si intentas eliminarla, verás un mensaje de error: \"No se puede eliminar la categoría porque tiene tareas asociadas\"")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Primero debes reasignar o eliminar esas tareas, y luego podrás eliminar la categoría")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Si no tiene tareas asociadas, se mostrará un diálogo de confirmación")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Confirmar\" para eliminarla")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del mensaje de error al intentar eliminar categoría con tareas\n(Mostrar: mensaje de error explicativo)")]
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 5. Gestión de Plantillas
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("5. Gestión de Plantillas")]
        }),
        new Paragraph({
          children: [new TextRun("Las plantillas son configuraciones reutilizables que te permiten crear tareas rápidamente con valores predefinidos. Son especialmente útiles para tareas repetitivas que creas con frecuencia.")],
          spacing: { after: 240 }
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("5.1. Ver todas las plantillas")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Plantillas\" en el menú superior")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Verás un listado con todas las plantillas creadas")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Cada plantilla muestra: Título (el que tendrá la tarea al crearse), Si es repetitiva o no, Tipo de recurrencia (diaria, semanal, mensual)")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de pantalla de la lista de plantillas\n(Mostrar: lista con al menos 2 plantillas, una repetitiva y una no repetitiva)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("5.2. Crear una plantilla nueva")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En la página de Plantillas, haz clic en \"Nueva Plantilla\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se abrirá un formulario con los siguientes campos:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Título", bold: true }), new TextRun(" (obligatorio): el título que tendrá la tarea cuando se cree desde esta plantilla")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "¿Es repetitiva?", bold: true }), new TextRun(": marca esta casilla si las tareas creadas deben ser repetitivas")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Recurrencia", bold: true }), new TextRun(" (si es repetitiva): selecciona Diaria, Semanal o Mensual")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("La plantilla aparecerá en el listado")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario de creación de plantillas")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun("Ejemplo: Crear una plantilla para \"Backup diario\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Nueva Plantilla\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Introduce el título: \"Realizar backup de base de datos\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Marca \"Es repetitiva\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Selecciona recurrencia: \"Diaria\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario completado con el ejemplo")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("5.3. Crear una tarea desde una plantilla (instanciar)")]
        }),
        new Paragraph({
          children: [new TextRun("Esta es la función principal de las plantillas: crear tareas rápidamente con un solo clic.")],
          spacing: { after: 120 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de plantillas, localiza la plantilla que quieres usar")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Instanciar\" o \"Crear Tarea\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se creará automáticamente una nueva tarea con:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("El título de la plantilla")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("La configuración de repetición (si la tiene)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Estado pendiente")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("Fecha de creación actual")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("La nueva tarea aparecerá en el listado de tareas")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📊 PLACEHOLDER: Infografía del flujo de instanciación de plantillas\n(Diagrama: Plantilla → Instanciar → Nueva tarea creada en la lista de tareas)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun("Ejemplo: Instanciar \"Backup diario\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Ve a la página de Plantillas")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Localiza la plantilla \"Realizar backup de base de datos\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Instanciar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Ve a la página de Tareas")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Verás una nueva tarea pendiente con el título \"Realizar backup de base de datos\" y configurada como repetitiva diaria")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura mostrando la nueva tarea creada a partir de la plantilla")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("5.4. Editar una plantilla")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de plantillas, localiza la que quieres modificar")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Editar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Modifica el título o la configuración de repetición")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Nota", bold: true }), new TextRun(": los cambios solo afectarán a las nuevas tareas que se creen a partir de esta plantilla; las tareas ya existentes no se modificarán")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario de edición de plantillas")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("5.5. Eliminar una plantilla")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de plantillas, localiza la que quieres eliminar")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Eliminar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se mostrará un diálogo de confirmación")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Confirmar\" para eliminarla")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Nota", bold: true }), new TextRun(": eliminar una plantilla no afecta a las tareas que ya se crearon desde ella")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del diálogo de confirmación de eliminación de plantillas")]
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 6. Gestión de Usuarios Asignados
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("6. Gestión de Usuarios Asignados")]
        }),
        new Paragraph({
          children: [new TextRun("Los usuarios asignados son las personas que pueden ser responsables de las tareas. Puedes crear, editar y eliminar usuarios, y luego asignarlos a tareas específicas.")],
          spacing: { after: 240 }
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("6.1. Ver todos los usuarios")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Usuarios\" en el menú superior")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Verás un listado con todos los usuarios registrados")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Cada usuario muestra: Nombre completo y Dirección de correo electrónico")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de pantalla de la lista de usuarios\n(Mostrar: lista con al menos 2 usuarios - Ana García, Carlos López)")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("6.2. Crear un usuario nuevo")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En la página de Usuarios, haz clic en \"Nuevo Usuario\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se abrirá un formulario con los siguientes campos:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Nombre", bold: true }), new TextRun(" (obligatorio): nombre completo del usuario")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Email", bold: true }), new TextRun(" (obligatorio): dirección de correo electrónico única")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("El usuario aparecerá en el listado y estará disponible para asignar a tareas")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario de creación de usuarios")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun("Ejemplo: Crear un usuario \"María Sánchez\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Nuevo Usuario\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Introduce el nombre: \"María Sánchez\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Introduce el email: \"maria.sanchez@empresa.com\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario completado con el ejemplo")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("6.3. Editar un usuario")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de usuarios, localiza el que quieres modificar")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Editar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Modifica el nombre o el email")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Los cambios se reflejarán en todas las tareas asignadas a este usuario")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del formulario de edición de usuarios")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("6.4. Eliminar un usuario")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de usuarios, localiza el que quieres eliminar")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en el botón \"Eliminar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se mostrará un diálogo de confirmación")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Confirmar\" para eliminarlo")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun({ text: "Importante", bold: true }), new TextRun(": las tareas que estaban asignadas a este usuario quedarán sin usuario asignado, pero no se eliminarán")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura del diálogo de confirmación de eliminación de usuarios")]
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 7. Casos de uso frecuentes
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("7. Casos de uso frecuentes")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("7.1. Configurar una reunión semanal recurrente")]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Situación: ", bold: true }), new TextRun("Tienes una reunión de equipo todos los lunes y quieres que aparezca automáticamente cada semana.")],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Pasos:", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Ve a Tareas → Nueva Tarea")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Título: \"Reunión de equipo semanal\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Categoría: \"Trabajo\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Usuario asignado: \"Ana García\" (quien lidera la reunión)")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Marca \"Es repetitiva\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Recurrencia: \"Semanal\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Haz clic en \"Guardar\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Cada vez que marques esta tarea como completada, se creará automáticamente la siguiente para la semana próxima")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("🎥 PLACEHOLDER: Video demostrativo (30 seg): Crear y completar tarea recurrente semanal")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("7.2. Crear una plantilla para tareas de backup diario")]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Situación: ", bold: true }), new TextRun("Necesitas recordar hacer un backup de la base de datos todos los días.")],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Opción A: Crear plantilla y usarla manualmente", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Ve a Plantillas → Nueva Plantilla")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Título: \"Backup base de datos\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Marca \"Es repetitiva\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Recurrencia: \"Diaria\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Guarda la plantilla")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Cada día, ve a Plantillas y haz clic en \"Instanciar\" para crear la tarea del día")]
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "Opción B: Crear una tarea repetitiva directamente", bold: true })],
          spacing: { before: 240, after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Ve a Tareas → Nueva Tarea")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Título: \"Backup base de datos\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Marca \"Es repetitiva\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Recurrencia: \"Diaria\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Guarda la tarea")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Al completarla cada día, se creará automáticamente la del día siguiente")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📊 PLACEHOLDER: Infografía comparando Opción A vs Opción B")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("7.3. Organizar tareas por proyecto con categorías")]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Situación: ", bold: true }), new TextRun("Trabajas en varios proyectos y quieres ver solo las tareas de cada uno.")],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Pasos:", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Ve a Categorías → Nueva Categoría")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Crea una categoría por proyecto:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("\"Proyecto Alpha\" - color azul (#0066CC)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("\"Proyecto Beta\" - color verde (#00CC66)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun("\"Administración\" - color gris (#999999)")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Al crear o editar tareas, asigna la categoría correspondiente")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Para ver solo las tareas de un proyecto, usa el filtro de categorías en la página de Tareas")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura mostrando filtro de categorías con proyectos")]
        }),
        
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("7.4. Asignar tareas a miembros del equipo")]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Situación: ", bold: true }), new TextRun("Quieres delegar tareas específicas a diferentes personas de tu equipo.")],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Pasos:", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Asegúrate de que todos los miembros del equipo estén en Usuarios")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Al crear o editar una tarea, selecciona el usuario responsable en el campo \"Usuario asignado\"")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("En el listado de tareas, verás quién es responsable de cada tarea")]
        }),
        
        new Paragraph({
          style: "Placeholder",
          children: [new TextRun("📷 PLACEHOLDER: Captura de la lista de tareas con usuarios asignados visibles")]
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 8. Preguntas frecuentes
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("8. Preguntas frecuentes")]
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "¿Qué pasa si completo una tarea repetitiva?", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun("Al marcar como completada una tarea repetitiva, se crean dos cosas:")],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("La tarea actual queda marcada como completada (historial)")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Se crea automáticamente una nueva tarea pendiente con la fecha calculada según la recurrencia:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Diaria", bold: true }), new TextRun(": para mañana")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Semanal", bold: true }), new TextRun(": dentro de 7 días")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 1 },
          children: [new TextRun({ text: "Mensual", bold: true }), new TextRun(": dentro de 30 días")]
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "¿Puedo eliminar una categoría que tiene tareas?", bold: true })],
          spacing: { before: 240, after: 80 }
        }),
        new Paragraph({
          children: [new TextRun("No. Para eliminar una categoría, primero debes:")],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Reasignar las tareas a otra categoría, o")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Eliminar las tareas que usan esa categoría, o")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Editar las tareas para quitarles la categoría")]
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "¿Qué diferencia hay entre una plantilla y una tarea repetitiva?", bold: true })],
          spacing: { before: 240, after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Plantilla", bold: true }), new TextRun(": es una configuración guardada que usas para crear tareas manualmente cuando lo necesites (haciendo clic en \"Instanciar\"). No genera tareas automáticamente.")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Tarea repetitiva", bold: true }), new TextRun(": es una tarea que, al completarse, genera automáticamente la siguiente ocurrencia sin intervención manual.")]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Usa plantillas cuando:", bold: true }), new TextRun(" necesites crear tareas similares ocasionalmente, pero no de forma automática (ej: \"Informe de proyecto\" que solo creas cuando terminas un proyecto).")],
          spacing: { before: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Usa tareas repetitivas cuando:", bold: true }), new TextRun(" quieras automatización completa de tareas periódicas (ej: \"Reunión semanal\" que siempre se repite al completarse).")],
          spacing: { before: 80 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "¿Se puede cambiar una tarea normal a repetitiva?", bold: true })],
          spacing: { before: 240, after: 80 }
        }),
        new Paragraph({
          children: [new TextRun("Sí. Edita la tarea, marca la casilla \"Es repetitiva\", selecciona la recurrencia, y guarda. A partir de ese momento, al completarla se generará la siguiente ocurrencia.")],
          spacing: { after: 160 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "¿Qué pasa si elimino un usuario que tiene tareas asignadas?", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun("El usuario se elimina, pero las tareas no. Las tareas quedan sin usuario asignado (campo vacío). Puedes reasignarlas a otro usuario editándolas.")],
          spacing: { after: 160 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "¿Puedo ver solo las tareas pendientes o solo las completadas?", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun("La aplicación muestra todas las tareas (pendientes y completadas) en el listado. Las tareas completadas se identifican visualmente con un indicador o estilo diferente.")],
          spacing: { after: 160 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "¿Se pueden editar tareas que ya están completadas?", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun("Sí, puedes editar cualquier tarea (completada o pendiente) usando el botón \"Editar\". Incluso puedes desmarcar \"Completada\" para volverla a pendiente.")],
          spacing: { after: 160 }
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 9. Solución de problemas
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("9. Solución de problemas")]
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "No puedo crear una tarea", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Posibles causas:", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("El campo Título está vacío (obligatorio)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Si marcaste \"Es repetitiva\", debes seleccionar un tipo de recurrencia (Diaria, Semanal o Mensual)")]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Solución:", bold: true }), new TextRun(" Asegúrate de completar todos los campos obligatorios antes de hacer clic en \"Guardar\".")],
          spacing: { before: 120, after: 240 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "No aparece la categoría o el usuario en el desplegable", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Causa:", bold: true }), new TextRun(" No has creado la categoría o el usuario todavía.")],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Solución:", bold: true }), new TextRun(" Ve primero a la sección de Categorías o Usuarios, crea el elemento necesario, y luego vuelve a crear/editar la tarea.")],
          spacing: { after: 240 }
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "No puedo eliminar una categoría", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Causa:", bold: true }), new TextRun(" La categoría tiene tareas asociadas.")],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Solución:", bold: true }), new TextRun(" Antes de eliminar la categoría, debes:")],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Ir a Tareas")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Filtrar por esa categoría")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Editar cada tarea para cambiarle la categoría o eliminarla")]
        }),
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun("Una vez que no haya tareas con esa categoría, podrás eliminarla")]
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "La tarea repetitiva no generó la siguiente ocurrencia", bold: true })],
          spacing: { before: 240, after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Posibles causas:", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("No usaste el botón \"Completar\", sino que editaste manualmente el estado")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("La tarea no tiene marcada la casilla \"Es repetitiva\" o no tiene configurada la recurrencia")]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Solución:", bold: true })],
          spacing: { before: 120, after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Para que funcione la generación automática, siempre usa el botón \"Completar\" en el listado de tareas")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Verifica en el formulario de edición que la tarea tenga marcada \"Es repetitiva\" y un tipo de recurrencia seleccionado")]
        }),
        
        new Paragraph({
          children: [new TextRun({ text: "No puedo acceder a la aplicación", bold: true })],
          spacing: { before: 240, after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Posibles causas:", bold: true })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("El servidor backend no está en ejecución")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("La URL es incorrecta")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun("Problemas de red o firewall")]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Solución:", bold: true }), new TextRun(" Contacta con tu administrador de sistemas o el responsable técnico del proyecto.")],
          spacing: { before: 120, after: 240 }
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 10. Glosario
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("10. Glosario")]
        }),
        
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Tarea", bold: true }), new TextRun(": elemento individual de trabajo pendiente o completado")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Categoría", bold: true }), new TextRun(": etiqueta temática con color para agrupar tareas")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Plantilla", bold: true }), new TextRun(": configuración reutilizable para crear tareas rápidamente")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Usuario asignado", bold: true }), new TextRun(": persona responsable de una tarea")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Tarea repetitiva", bold: true }), new TextRun(": tarea que se regenera automáticamente al completarse")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Recurrencia", bold: true }), new TextRun(": periodicidad de repetición (diaria, semanal, mensual)")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Instanciar", bold: true }), new TextRun(": crear una nueva tarea a partir de una plantilla")]
        }),
        
        new Paragraph({ children: [new PageBreak()] }),
        
        // 11. Soporte y contacto
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("11. Soporte y contacto")]
        }),
        new Paragraph({
          children: [new TextRun("Si tienes problemas técnicos, dudas sobre el uso de la aplicación, o sugerencias de mejora, contacta con:")],
          spacing: { after: 240 }
        }),
        
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Soporte técnico:", bold: true }), new TextRun(" soporte@apptodolist.example")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Equipo de desarrollo:", bold: true }), new TextRun(" desarrollo@apptodolist.example")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun({ text: "Documentación online:", bold: true }), new TextRun(" https://apptodolist.example/docs")]
        }),
        
        new Paragraph({
          children: [new TextRun("")],
          spacing: { before: 480 }
        }),
        
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Fin del manual de usuario", italics: true, color: "666666" })]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("docs/manual-usuario.docx", buffer);
  console.log("✅ Documento Word generado: docs/manual-usuario.docx");
});
