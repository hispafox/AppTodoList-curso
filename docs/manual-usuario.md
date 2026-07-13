# Manual de Usuario — Lista de Tareas

**Versión:** 2.0  
**Fecha:** 26 de junio de 2026  
**Aplicación:** AppTodoList — Gestión de Tareas

---

## 1. Introducción

### ¿Qué es esta aplicación?

Lista de Tareas es una aplicación web que te permite organizar y gestionar tus tareas pendientes de forma simple y efectiva. Podrás crear tareas, asignarlas a usuarios, clasificarlas por categorías, y configurar tareas que se repiten automáticamente.

### ¿Para quién es?

Esta aplicación está diseñada para cualquier persona o equipo que necesite:
- Llevar un registro de tareas pendientes
- Organizar el trabajo por categorías (Trabajo, Personal, Urgente, etc.)
- Asignar tareas a miembros del equipo
- Automatizar tareas recurrentes (reuniones semanales, backups diarios, etc.)

### ¿Qué puedes hacer con ella?

- **Crear y gestionar tareas**: añade nuevas tareas, edita su contenido, marca como completadas o elimínalas
- **Organizar con categorías**: agrupa tus tareas por temas con colores visuales
- **Asignar responsables**: vincula tareas a usuarios específicos
- **Automatizar repeticiones**: crea tareas que se regeneran automáticamente al completarse (diarias, semanales o mensuales)
- **Usar plantillas**: guarda configuraciones de tareas frecuentes para crearlas rápidamente

---

## 2. Primeros pasos

### Acceder a la aplicación

1. Abre tu navegador web (Chrome, Firefox, Edge, Safari)
2. Introduce la dirección: `http://localhost:5173` (en desarrollo) o la URL proporcionada por tu administrador
3. La aplicación cargará la pantalla principal con el listado de tareas

[PLACEHOLDER: Captura de pantalla de la página principal de la aplicación]
<!-- Mostrar: barra de navegación superior, lista de tareas, botones de acción principales -->

### Navegación básica

La aplicación cuenta con cuatro secciones principales, accesibles desde el menú superior:

- **Tareas**: gestión completa de tus tareas pendientes y completadas
- **Categorías**: crea y gestiona las categorías para organizar tus tareas
- **Plantillas**: define plantillas reutilizables para crear tareas rápidamente
- **Usuarios**: administra la lista de usuarios que pueden ser asignados a tareas

[PLACEHOLDER: Captura de pantalla del menú de navegación]
<!-- Incluir: menú superior con las 4 secciones resaltadas -->

### Interfaz principal

Cada sección sigue la misma estructura:
- **Listado**: tabla o lista con todos los elementos
- **Botón "Nuevo"**: crea un nuevo elemento
- **Acciones por elemento**: editar, eliminar, o acciones específicas (completar, instanciar, etc.)
- **Filtros** (si están disponibles): opciones para filtrar la lista

---

## 3. Gestión de Tareas

Las tareas son el elemento central de la aplicación. Cada tarea tiene un título, un estado (pendiente o completada), fecha de creación, y puede tener categoría, usuario asignado, y configuración de repetición.

### 3.1. Ver todas las tareas

1. Haz clic en **"Tareas"** en el menú superior
2. Verás un listado con todas las tareas existentes
3. Cada tarea muestra:
   - Título
   - Estado (pendiente o completada)
   - Categoría asignada (con su color)
   - Usuario asignado (si lo tiene)
   - Fecha de creación
   - Tipo de recurrencia (si es repetitiva)

[PLACEHOLDER: Captura de pantalla de la lista de tareas]
<!-- Mostrar: tabla con varias tareas, algunas completadas, con categorías de colores, usuarios asignados -->

### 3.2. Crear una tarea nueva

1. En la página de **Tareas**, haz clic en el botón **"Nueva Tarea"**
2. Se abrirá un formulario con los siguientes campos:
   - **Título** (obligatorio): escribe el nombre de la tarea
   - **Categoría** (opcional): selecciona una categoría del desplegable
   - **Usuario asignado** (opcional): selecciona un usuario responsable
   - **¿Es repetitiva?**: marca esta casilla si quieres que la tarea se repita automáticamente
   - **Recurrencia** (si es repetitiva): selecciona Diaria, Semanal o Mensual
3. Haz clic en **"Guardar"**
4. La tarea aparecerá en el listado principal

[PLACEHOLDER: Captura de pantalla del formulario de creación de tareas]
<!-- Incluir: todos los campos visibles, casilla de repetitiva sin marcar, desplegables de categoría y usuario -->

#### Ejemplo: Crear una tarea simple

1. Haz clic en "Nueva Tarea"
2. Introduce el título: **"Revisar correo electrónico"**
3. Selecciona categoría: **"Trabajo"**
4. Deja sin marcar "Es repetitiva"
5. Haz clic en "Guardar"

[PLACEHOLDER: Captura del formulario completado con el ejemplo]

#### Ejemplo: Crear una tarea recurrente semanal

1. Haz clic en "Nueva Tarea"
2. Introduce el título: **"Reunión de equipo"**
3. Selecciona categoría: **"Trabajo"**
4. Selecciona usuario: **"Ana García"**
5. Marca la casilla **"Es repetitiva"**
6. Selecciona recurrencia: **"Semanal"**
7. Haz clic en "Guardar"

[PLACEHOLDER: Captura del formulario con tarea repetitiva configurada]
<!-- Mostrar: casilla marcada, desplegable de recurrencia visible con "Semanal" seleccionado -->

### 3.3. Editar una tarea

1. En el listado de tareas, busca la tarea que quieres modificar
2. Haz clic en el botón **"Editar"** (icono de lápiz)
3. Se abrirá el formulario de edición con los datos actuales de la tarea
4. Modifica los campos que necesites:
   - Título
   - Categoría
   - Usuario asignado
   - Estado (pendiente/completada)
   - Configuración de repetición
5. Haz clic en **"Guardar"**
6. Los cambios se reflejarán inmediatamente en el listado

[PLACEHOLDER: Captura de pantalla del formulario de edición]
<!-- Mostrar: formulario con datos precargados, campos modificables, botón "Guardar" -->

### 3.4. Marcar una tarea como completada

Hay dos formas de completar una tarea:

#### Opción A: Usar el botón "Completar"

1. En el listado de tareas, localiza la tarea pendiente
2. Haz clic en el botón **"Completar"** (icono de check o marca de verificación)
3. La tarea se marcará como completada
4. **Si la tarea es repetitiva**, se creará automáticamente una nueva ocurrencia con la fecha calculada según la recurrencia:
   - **Diaria**: nueva tarea para mañana
   - **Semanal**: nueva tarea dentro de 7 días
   - **Mensual**: nueva tarea dentro de 30 días

[PLACEHOLDER: Captura mostrando tarea antes y después de completar]
<!-- Mostrar: estado pendiente → estado completado, y si es repetitiva, nueva tarea generada -->

#### Opción B: Editar y cambiar el estado

1. Haz clic en **"Editar"** en la tarea
2. Marca la casilla **"Completada"**
3. Haz clic en "Guardar"

[PLACEHOLDER: Infografía del flujo de tareas repetitivas]
<!-- Diagrama: Tarea repetitiva pendiente → Completar → Tarea marcada completada + Nueva tarea generada automáticamente -->

### 3.5. Filtrar tareas por categoría

1. En la página de **Tareas**, localiza el selector de **"Filtrar por categoría"**
2. Selecciona una categoría del desplegable
3. La lista mostrará solo las tareas de esa categoría
4. Para ver todas las tareas de nuevo, selecciona **"Todas las categorías"** o la opción por defecto

[PLACEHOLDER: Captura del filtro de categorías en acción]
<!-- Mostrar: desplegable de categorías, lista filtrada con tareas de una sola categoría -->

### 3.6. Eliminar una tarea

1. En el listado de tareas, localiza la tarea que quieres eliminar
2. Haz clic en el botón **"Eliminar"** (icono de papelera)
3. Se mostrará un diálogo de confirmación: **"¿Estás seguro de que quieres eliminar esta tarea?"**
4. Haz clic en **"Confirmar"** para eliminarla definitivamente, o en **"Cancelar"** para mantenerla
5. La tarea desaparecerá del listado

[PLACEHOLDER: Captura del diálogo de confirmación de eliminación]
<!-- Mostrar: modal con mensaje, botones Confirmar y Cancelar -->

---

## 4. Gestión de Categorías

Las categorías te permiten organizar y agrupar tareas por tema, proyecto o prioridad. Cada categoría tiene un nombre y un color visual que ayuda a identificarlas rápidamente.

### 4.1. Ver todas las categorías

1. Haz clic en **"Categorías"** en el menú superior
2. Verás un listado con todas las categorías creadas
3. Cada categoría muestra:
   - Nombre
   - Color (representado visualmente)

[PLACEHOLDER: Captura de pantalla de la lista de categorías]
<!-- Mostrar: lista con al menos 3 categorías, colores visibles (Trabajo #FF5733, Personal #33C4FF, Urgente #FF3333) -->

### 4.2. Crear una categoría nueva

1. En la página de **Categorías**, haz clic en **"Nueva Categoría"**
2. Se abrirá un formulario con los siguientes campos:
   - **Nombre** (obligatorio): escribe el nombre de la categoría
   - **Color** (obligatorio): selecciona un color usando el selector visual o introduce un código hexadecimal (ejemplo: #FF5733)
3. Haz clic en **"Guardar"**
4. La categoría aparecerá en el listado y estará disponible para asignar a tareas

[PLACEHOLDER: Captura de pantalla del formulario de creación de categorías]
<!-- Incluir: campo de nombre, selector de color visual -->

#### Ejemplo: Crear una categoría "Urgente"

1. Haz clic en "Nueva Categoría"
2. Introduce el nombre: **"Urgente"**
3. Selecciona un color rojo: **#FF3333**
4. Haz clic en "Guardar"

[PLACEHOLDER: Captura del formulario completado con el ejemplo]

### 4.3. Editar una categoría

1. En el listado de categorías, localiza la que quieres modificar
2. Haz clic en el botón **"Editar"**
3. Modifica el nombre o el color
4. Haz clic en **"Guardar"**
5. Los cambios se aplicarán a todas las tareas que tengan esta categoría asignada

[PLACEHOLDER: Captura del formulario de edición de categorías]

### 4.4. Eliminar una categoría

1. En el listado de categorías, localiza la que quieres eliminar
2. Haz clic en el botón **"Eliminar"**
3. **Importante**: no podrás eliminar una categoría que tenga tareas asociadas activas
   - Si intentas eliminarla, verás un mensaje de error: **"No se puede eliminar la categoría porque tiene tareas asociadas"**
   - Primero debes reasignar o eliminar esas tareas, y luego podrás eliminar la categoría
4. Si no tiene tareas asociadas, se mostrará un diálogo de confirmación
5. Haz clic en **"Confirmar"** para eliminarla

[PLACEHOLDER: Captura del mensaje de error al intentar eliminar categoría con tareas]
<!-- Mostrar: mensaje de error explicativo -->

---

## 5. Gestión de Plantillas

Las plantillas son configuraciones reutilizables que te permiten crear tareas rápidamente con valores predefinidos. Son especialmente útiles para tareas repetitivas que creas con frecuencia.

### 5.1. Ver todas las plantillas

1. Haz clic en **"Plantillas"** en el menú superior
2. Verás un listado con todas las plantillas creadas
3. Cada plantilla muestra:
   - Título (el que tendrá la tarea al crearse)
   - Si es repetitiva o no
   - Tipo de recurrencia (diaria, semanal, mensual)

[PLACEHOLDER: Captura de pantalla de la lista de plantillas]
<!-- Mostrar: lista con al menos 2 plantillas, una repetitiva y una no repetitiva -->

### 5.2. Crear una plantilla nueva

1. En la página de **Plantillas**, haz clic en **"Nueva Plantilla"**
2. Se abrirá un formulario con los siguientes campos:
   - **Título** (obligatorio): el título que tendrá la tarea cuando se cree desde esta plantilla
   - **¿Es repetitiva?**: marca esta casilla si las tareas creadas deben ser repetitivas
   - **Recurrencia** (si es repetitiva): selecciona Diaria, Semanal o Mensual
3. Haz clic en **"Guardar"**
4. La plantilla aparecerá en el listado

[PLACEHOLDER: Captura del formulario de creación de plantillas]

#### Ejemplo: Crear una plantilla para "Backup diario"

1. Haz clic en "Nueva Plantilla"
2. Introduce el título: **"Realizar backup de base de datos"**
3. Marca **"Es repetitiva"**
4. Selecciona recurrencia: **"Diaria"**
5. Haz clic en "Guardar"

[PLACEHOLDER: Captura del formulario completado con el ejemplo]

### 5.3. Crear una tarea desde una plantilla (instanciar)

Esta es la función principal de las plantillas: crear tareas rápidamente con un solo clic.

1. En el listado de plantillas, localiza la plantilla que quieres usar
2. Haz clic en el botón **"Instanciar"** o **"Crear Tarea"**
3. Se creará automáticamente una nueva tarea con:
   - El título de la plantilla
   - La configuración de repetición (si la tiene)
   - Estado pendiente
   - Fecha de creación actual
4. La nueva tarea aparecerá en el listado de tareas

[PLACEHOLDER: Infografía del flujo de instanciación de plantillas]
<!-- Diagrama: Plantilla → Instanciar → Nueva tarea creada en la lista de tareas -->

#### Ejemplo: Instanciar "Backup diario"

1. Ve a la página de **Plantillas**
2. Localiza la plantilla **"Realizar backup de base de datos"**
3. Haz clic en **"Instanciar"**
4. Ve a la página de **Tareas**
5. Verás una nueva tarea pendiente con el título "Realizar backup de base de datos" y configurada como repetitiva diaria

[PLACEHOLDER: Captura mostrando la nueva tarea creada a partir de la plantilla]

### 5.4. Editar una plantilla

1. En el listado de plantillas, localiza la que quieres modificar
2. Haz clic en el botón **"Editar"**
3. Modifica el título o la configuración de repetición
4. Haz clic en **"Guardar"**
5. **Nota**: los cambios solo afectarán a las nuevas tareas que se creen a partir de esta plantilla; las tareas ya existentes no se modificarán

[PLACEHOLDER: Captura del formulario de edición de plantillas]

### 5.5. Eliminar una plantilla

1. En el listado de plantillas, localiza la que quieres eliminar
2. Haz clic en el botón **"Eliminar"**
3. Se mostrará un diálogo de confirmación
4. Haz clic en **"Confirmar"** para eliminarla
5. **Nota**: eliminar una plantilla no afecta a las tareas que ya se crearon desde ella

[PLACEHOLDER: Captura del diálogo de confirmación de eliminación de plantillas]

---

## 6. Gestión de Usuarios Asignados

Los usuarios asignados son las personas que pueden ser responsables de las tareas. Puedes crear, editar y eliminar usuarios, y luego asignarlos a tareas específicas.

### 6.1. Ver todos los usuarios

1. Haz clic en **"Usuarios"** en el menú superior
2. Verás un listado con todos los usuarios registrados
3. Cada usuario muestra:
   - Nombre completo
   - Dirección de correo electrónico

[PLACEHOLDER: Captura de pantalla de la lista de usuarios]
<!-- Mostrar: lista con al menos 2 usuarios (Ana García, Carlos López) -->

### 6.2. Crear un usuario nuevo

1. En la página de **Usuarios**, haz clic en **"Nuevo Usuario"**
2. Se abrirá un formulario con los siguientes campos:
   - **Nombre** (obligatorio): nombre completo del usuario
   - **Email** (obligatorio): dirección de correo electrónico única
3. Haz clic en **"Guardar"**
4. El usuario aparecerá en el listado y estará disponible para asignar a tareas

[PLACEHOLDER: Captura del formulario de creación de usuarios]

#### Ejemplo: Crear un usuario "María Sánchez"

1. Haz clic en "Nuevo Usuario"
2. Introduce el nombre: **"María Sánchez"**
3. Introduce el email: **"maria.sanchez@empresa.com"**
4. Haz clic en "Guardar"

[PLACEHOLDER: Captura del formulario completado con el ejemplo]

### 6.3. Editar un usuario

1. En el listado de usuarios, localiza el que quieres modificar
2. Haz clic en el botón **"Editar"**
3. Modifica el nombre o el email
4. Haz clic en **"Guardar"**
5. Los cambios se reflejarán en todas las tareas asignadas a este usuario

[PLACEHOLDER: Captura del formulario de edición de usuarios]

### 6.4. Eliminar un usuario

1. En el listado de usuarios, localiza el que quieres eliminar
2. Haz clic en el botón **"Eliminar"**
3. Se mostrará un diálogo de confirmación
4. Haz clic en **"Confirmar"** para eliminarlo
5. **Importante**: las tareas que estaban asignadas a este usuario quedarán sin usuario asignado, pero no se eliminarán

[PLACEHOLDER: Captura del diálogo de confirmación de eliminación de usuarios]

---

## 7. Casos de uso frecuentes

### 7.1. Configurar una reunión semanal recurrente

**Situación**: Tienes una reunión de equipo todos los lunes y quieres que aparezca automáticamente cada semana.

**Pasos**:
1. Ve a **Tareas** → **Nueva Tarea**
2. Título: **"Reunión de equipo semanal"**
3. Categoría: **"Trabajo"**
4. Usuario asignado: **"Ana García"** (quien lidera la reunión)
5. Marca **"Es repetitiva"**
6. Recurrencia: **"Semanal"**
7. Haz clic en **"Guardar"**
8. Cada vez que marques esta tarea como completada, se creará automáticamente la siguiente para la semana próxima

[PLACEHOLDER: Video demostrativo (30 seg): Crear y completar tarea recurrente semanal]

### 7.2. Crear una plantilla para tareas de backup diario

**Situación**: Necesitas recordar hacer un backup de la base de datos todos los días.

**Opción A: Crear plantilla y usarla manualmente**
1. Ve a **Plantillas** → **Nueva Plantilla**
2. Título: **"Backup base de datos"**
3. Marca **"Es repetitiva"**
4. Recurrencia: **"Diaria"**
5. Guarda la plantilla
6. Cada día, ve a **Plantillas** y haz clic en **"Instanciar"** para crear la tarea del día

**Opción B: Crear una tarea repetitiva directamente**
1. Ve a **Tareas** → **Nueva Tarea**
2. Título: **"Backup base de datos"**
3. Marca **"Es repetitiva"**
4. Recurrencia: **"Diaria"**
5. Guarda la tarea
6. Al completarla cada día, se creará automáticamente la del día siguiente

[PLACEHOLDER: Infografía comparando Opción A vs Opción B]

### 7.3. Organizar tareas por proyecto con categorías

**Situación**: Trabajas en varios proyectos y quieres ver solo las tareas de cada uno.

**Pasos**:
1. Ve a **Categorías** → **Nueva Categoría**
2. Crea una categoría por proyecto:
   - **"Proyecto Alpha"** - color azul (#0066CC)
   - **"Proyecto Beta"** - color verde (#00CC66)
   - **"Administración"** - color gris (#999999)
3. Al crear o editar tareas, asigna la categoría correspondiente
4. Para ver solo las tareas de un proyecto, usa el filtro de categorías en la página de **Tareas**

[PLACEHOLDER: Captura mostrando filtro de categorías con proyectos]

### 7.4. Asignar tareas a miembros del equipo

**Situación**: Quieres delegar tareas específicas a diferentes personas de tu equipo.

**Pasos**:
1. Asegúrate de que todos los miembros del equipo estén en **Usuarios**
2. Al crear o editar una tarea, selecciona el usuario responsable en el campo **"Usuario asignado"**
3. En el listado de tareas, verás quién es responsable de cada tarea

[PLACEHOLDER: Captura de la lista de tareas con usuarios asignados visibles]

---

## 8. Preguntas frecuentes

### ¿Qué pasa si completo una tarea repetitiva?

Al marcar como completada una tarea repetitiva, se crean dos cosas:
1. La tarea actual queda marcada como completada (historial)
2. Se crea automáticamente una nueva tarea pendiente con la fecha calculada según la recurrencia:
   - **Diaria**: para mañana
   - **Semanal**: dentro de 7 días
   - **Mensual**: dentro de 30 días

### ¿Puedo eliminar una categoría que tiene tareas?

No. Para eliminar una categoría, primero debes:
- Reasignar las tareas a otra categoría, o
- Eliminar las tareas que usan esa categoría, o
- Editar las tareas para quitarles la categoría

### ¿Qué diferencia hay entre una plantilla y una tarea repetitiva?

- **Plantilla**: es una configuración guardada que usas para crear tareas manualmente cuando lo necesites (haciendo clic en "Instanciar"). No genera tareas automáticamente.
- **Tarea repetitiva**: es una tarea que, al completarse, genera automáticamente la siguiente ocurrencia sin intervención manual.

**Usa plantillas cuando**: necesites crear tareas similares ocasionalmente, pero no de forma automática (ej: "Informe de proyecto" que solo creas cuando terminas un proyecto).

**Usa tareas repetitivas cuando**: quieras automatización completa de tareas periódicas (ej: "Reunión semanal" que siempre se repite al completarse).

### ¿Se puede cambiar una tarea normal a repetitiva?

Sí. Edita la tarea, marca la casilla **"Es repetitiva"**, selecciona la recurrencia, y guarda. A partir de ese momento, al completarla se generará la siguiente ocurrencia.

### ¿Qué pasa si elimino un usuario que tiene tareas asignadas?

El usuario se elimina, pero las tareas no. Las tareas quedan sin usuario asignado (campo vacío). Puedes reasignarlas a otro usuario editándolas.

### ¿Puedo ver solo las tareas pendientes o solo las completadas?

La aplicación muestra todas las tareas (pendientes y completadas) en el listado. Las tareas completadas se identifican visualmente con un indicador o estilo diferente.

### ¿Se pueden editar tareas que ya están completadas?

Sí, puedes editar cualquier tarea (completada o pendiente) usando el botón "Editar". Incluso puedes desmarcar "Completada" para volverla a pendiente.

---

## 9. Solución de problemas

### No puedo crear una tarea

**Posibles causas**:
- El campo **Título** está vacío (obligatorio)
- Si marcaste "Es repetitiva", debes seleccionar un tipo de recurrencia (Diaria, Semanal o Mensual)

**Solución**: Asegúrate de completar todos los campos obligatorios antes de hacer clic en "Guardar".

### No aparece la categoría o el usuario en el desplegable

**Causa**: No has creado la categoría o el usuario todavía.

**Solución**: Ve primero a la sección de **Categorías** o **Usuarios**, crea el elemento necesario, y luego vuelve a crear/editar la tarea.

### No puedo eliminar una categoría

**Causa**: La categoría tiene tareas asociadas.

**Solución**: Antes de eliminar la categoría, debes:
1. Ir a **Tareas**
2. Filtrar por esa categoría
3. Editar cada tarea para cambiarle la categoría o eliminarla
4. Una vez que no haya tareas con esa categoría, podrás eliminarla

### La tarea repetitiva no generó la siguiente ocurrencia

**Posibles causas**:
- No usaste el botón **"Completar"**, sino que editaste manualmente el estado
- La tarea no tiene marcada la casilla "Es repetitiva" o no tiene configurada la recurrencia

**Solución**: 
- Para que funcione la generación automática, siempre usa el botón **"Completar"** en el listado de tareas
- Verifica en el formulario de edición que la tarea tenga marcada "Es repetitiva" y un tipo de recurrencia seleccionado

### No puedo acceder a la aplicación

**Posibles causas**:
- El servidor backend no está en ejecución
- La URL es incorrecta
- Problemas de red o firewall

**Solución**: Contacta con tu administrador de sistemas o el responsable técnico del proyecto.

---

## 10. Glosario

- **Tarea**: elemento individual de trabajo pendiente o completado
- **Categoría**: etiqueta temática con color para agrupar tareas
- **Plantilla**: configuración reutilizable para crear tareas rápidamente
- **Usuario asignado**: persona responsable de una tarea
- **Tarea repetitiva**: tarea que se regenera automáticamente al completarse
- **Recurrencia**: periodicidad de repetición (diaria, semanal, mensual)
- **Instanciar**: crear una nueva tarea a partir de una plantilla

---

## 11. Soporte y contacto

Si tienes problemas técnicos, dudas sobre el uso de la aplicación, o sugerencias de mejora, contacta con:

- **Soporte técnico**: soporte@apptodolist.example
- **Equipo de desarrollo**: desarrollo@apptodolist.example
- **Documentación online**: https://apptodolist.example/docs

---

**Fin del manual de usuario**
