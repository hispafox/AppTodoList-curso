# Instrucciones para generar el manual de usuario en formato Word

## Opción 1: Usar Node.js (recomendado)

### Requisitos
- Node.js instalado
- Paquete `docx` instalado globalmente

### Pasos
```bash
# 1. Instalar el paquete docx (si no está instalado)
npm install -g docx

# 2. Ejecutar el script
cd docs
node generar_manual_usuario.js
```

El archivo `manual-usuario.docx` se generará en la carpeta `docs/`.

---

## Opción 2: Usar Python

### Requisitos
- Python 3.x instalado
- Paquete `python-docx` instalado

### Pasos
```bash
# 1. Instalar el paquete python-docx (si no está instalado)
pip install python-docx

# 2. Ejecutar el script
cd docs
python generar_manual_usuario_python.py
```

El archivo `manual-usuario.docx` se generará en la carpeta `docs/`.

---

## Archivos generados

- `manual-usuario.md` — Versión Markdown (fuente de verdad, ya generado)
- `manual-usuario.docx` — Versión Word profesional (se generará tras ejecutar el script)

---

## Contenido del manual

El manual incluye:

1. **Portada profesional** con título, versión y fecha
2. **Tabla de contenidos automática**
3. **11 secciones**:
   - Introducción
   - Primeros pasos
   - Gestión de Tareas
   - Gestión de Categorías
   - Gestión de Plantillas
   - Gestión de Usuarios Asignados
   - Casos de uso frecuentes
   - Preguntas frecuentes
   - Solución de problemas
   - Glosario
   - Soporte y contacto

4. **18 placeholders para capturas de pantalla** — Identificados con 📷 y cajas grises con texto explicativo
5. **3 placeholders para infografías** — Identificados con 📊
6. **1 placeholder para video** — Identificado con 🎥

---

## Próximos pasos

1. **Ejecutar el script** para generar el documento Word
2. **Abrir el documento** en Microsoft Word, LibreOffice o Google Docs
3. **Reemplazar los placeholders** con capturas de pantalla reales de la aplicación
4. **Revisar el contenido** y ajustar según necesidades del proyecto
5. **Distribuir el manual** a los usuarios finales
