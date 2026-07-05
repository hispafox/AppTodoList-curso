# Dónde encontrar skills de ejemplo

> Hoja de recursos para el curso de GitHub Copilot — **Agent Skills (`SKILL.md`)**

Una *skill* es una carpeta con un archivo `SKILL.md`: instrucciones en lenguaje claro que tu agente lee **solo cuando hacen falta**. No es código, son instrucciones. La mejor forma de aprender a crearlas es **leer las de otros**. Aquí tienes dónde.

---

## 1. Empieza por aquí (oficiales y fiables)

- **github/awesome-copilot** — https://github.com/github/awesome-copilot
  La colección de GitHub, compatible con GitHub Copilot directamente. Se instala con `gh skill install github/awesome-copilot <nombre>` o copiando la carpeta a mano. Empieza por aquí.

- **anthropics/skills** — https://github.com/anthropics/skills
  Un repositorio de referencia del estándar. Incluye una `template-skill` para copiar y skills reales (un creador de skills, uno de diseño frontend…). Léete 3 o 4 de estas.

---

## 2. Colecciones grandes y curadas (para ver variedad)

- **VoltAgent/awesome-agent-skills** — https://github.com/VoltAgent/awesome-agent-skills
  Skills a cientos, de equipos oficiales (Vercel, Google, Stripe, Cloudflare, Figma…) y de la comunidad. Seleccionadas a mano, no generadas en masa.

- **heilcheng/awesome-agent-skills** — https://github.com/heilcheng/awesome-agent-skills
  Tutoriales, guías y directorios de skills. Buen punto de entrada con explicaciones.

- **openai/skills** — https://github.com/openai/skills
  Las del ecosistema de OpenAI. Mismo formato `SKILL.md`: sirve para ver que el estándar es común a todas las herramientas compatibles.

- **GoogleChrome/modern-web-guidance** — https://github.com/GoogleChrome/modern-web-guidance
  Skills oficiales del equipo de Chrome (accesibilidad, rendimiento, web moderna).

---

## 3. Buscadores y directorios

- **skills.sh** — https://skills.sh
  Leaderboard de Vercel. Para ver de un vistazo los repositorios de skills más populares y sus estadísticas de uso.

- **agentskills.io** — https://agentskills.io
  La web del estándar abierto. Aquí está la especificación oficial del formato.

---

## 4. Instalar sin copiar carpetas a mano (CLI)

- **vercel-labs/skills** (`npx skills`) — https://github.com/vercel-labs/skills
  Funciona como un "gestor de paquetes" de skills. Detecta qué agentes tienes y coloca los archivos en la ruta correcta.

  ```bash
  npx skills find <búsqueda>      # buscar skills
  npx skills add <owner/repo>     # instalar
  npx skills list                 # ver instaladas
  npx skills update               # actualizar
  ```

- **gh skill** (GitHub CLI, v2.90.0+) — en vista previa pública

  ```bash
  gh skill preview <owner/repo> <skill>   # INSPECCIONAR antes de instalar
  gh skill install <owner/repo> <skill>   # instalar
  ```

---

## 5. En español

- **crucenojmc/ia-agents-and-skills** — https://github.com/crucenojmc/ia-agents-and-skills
  Recopilatorio en castellano que enlaza a `skills.sh`, `awesome-copilot` y otras colecciones.

- **Web Reactiva** — guía de skills para programadores: https://www.webreactiva.com/blog/skills-programadores-agentes-ia
  Explicación clara del CLI `npx skills` y de cómo se estructura un `SKILL.md`, en español.

---

## ⚠️ Antes de instalar nada: seguridad

Las skills **no las verifica nadie por ti**. Un `SKILL.md` puede contener instrucciones ocultas o scripts maliciosos. Regla de oro:

> **Inspecciona siempre el contenido antes de instalar** — con `gh skill preview` o, simplemente, abriendo el `SKILL.md` y leyéndolo.

No instales a ciegas. Si no entiendes lo que hace una skill, no la uses.

---

## Recordatorio: dónde van las skills

| Ámbito | Ruta | Para qué |
|---|---|---|
| Proyecto (repo) | `.github/skills/<nombre>/SKILL.md` | Compartida con el equipo vía Git |
| Proyecto (compat.) | `.claude/skills/<nombre>/SKILL.md` | GitHub Copilot también las lee |
| Personal | `~/.copilot/skills/` o `~/.agents/skills/` | Tuyas, en todos tus proyectos |

Cada `SKILL.md` necesita como mínimo un *frontmatter* YAML con `name` y `description`, y debajo las instrucciones en Markdown. La `description` es lo que decide **cuándo** se activa: escríbela con claridad.

---

## Tabla resumen

| Recurso | Tipo | Enlace |
|---|---|---|
| github/awesome-copilot | Oficial · Copilot | github.com/github/awesome-copilot |
| anthropics/skills | Referencia · estándar | github.com/anthropics/skills |
| VoltAgent/awesome-agent-skills | Colección grande | github.com/VoltAgent/awesome-agent-skills |
| heilcheng/awesome-agent-skills | Guías y directorios | github.com/heilcheng/awesome-agent-skills |
| openai/skills | Colección | github.com/openai/skills |
| GoogleChrome/modern-web-guidance | Oficial · Chrome | github.com/GoogleChrome/modern-web-guidance |
| skills.sh | Buscador | skills.sh |
| agentskills.io | Especificación | agentskills.io |
| vercel-labs/skills | CLI | github.com/vercel-labs/skills |
| crucenojmc/ia-agents-and-skills | En español | github.com/crucenojmc/ia-agents-and-skills |
