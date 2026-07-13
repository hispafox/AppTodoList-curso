# Skill: github-flow

Encapsula operaciones del flujo Issue → Branch → PR en AppTodoList.

## Cuándo usar

- El orquestador lo invoca automáticamente en Modo Issue
- También puedes invocarlo directamente para operaciones GitHub aisladas

## Funcionalidades

### 1. Leer issue

```
@github-flow leer-issue <número>
```

**Devuelve:**
- Título
- Descripción (body)
- Estado (open/closed)
- Labels
- Assignees

**Implementación:**
Usa `mcp_github_mcp_se_issue_read` con método `"get"`.

---

### 2. Crear rama feature

```
@github-flow crear-rama <issue-number> <slug>
```

**Efecto:**
1. Verifica que `git remote -v` da `hispafox/AppTodoList`
2. Verifica que estás en `main` con `git branch --show-current`
3. Crea rama `feature/issue-<N>-<slug>` con `mcp_github_mcp_se_create_branch` desde `main`
4. Ejecuta `git checkout feature/issue-<N>-<slug>`

**Devuelve:**
- Nombre de la rama creada
- Confirmación de checkout

---

### 3. Crear Pull Request

```
@github-flow crear-pr <issue-number> <branch-name> <plan-path> [draft]
```

**Parámetros:**
- `issue-number`: Número del issue a vincular
- `branch-name`: Nombre de la rama feature (ej. `feature/issue-15-indices-fks`)
- `plan-path`: Ruta al plan de implementación (ej. `docs/plan-indices-fks.md`)
- `draft`: (opcional) `true` si debe ser PR en borrador

**Efecto:**
1. Lee el issue para obtener el título
2. Ejecuta `git diff main...<branch-name> --name-only` para listar ficheros modificados
3. Crea PR con `mcp_github_mcp_se_create_pull_request`:
   - `title`: Título del issue
   - `body`: Template con referencia al issue, plan, y lista de ficheros
   - `head`: `<branch-name>`
   - `base`: `main`
   - `draft`: según parámetro

**Devuelve:**
- Número del PR creado
- URL del PR

---

### 4. Comentar en issue

```
@github-flow comentar-issue <número> <mensaje>
```

**Efecto:**
Usa `mcp_github_mcp_se_add_issue_comment` para añadir un comentario en el issue.

**Devuelve:**
- Confirmación de comentario publicado

---

## Variables de entorno

El skill detecta automáticamente:
- `owner`: Extrae de `git remote -v` (primera línea que contenga `github.com:`)
- `repo`: Extrae de la misma línea

**Formato esperado:**
```
origin  git@github.com:hispafox/AppTodoList.git (fetch)
```

O:
```
origin  https://github.com/hispafox/AppTodoList.git (fetch)
```

---

## Ejemplo completo

```bash
# Leer issue
@github-flow leer-issue 15
# → Devuelve: "Añadir Índices en Foreign Keys"

# Crear rama
@github-flow crear-rama 15 indices-fks
# → Crea feature/issue-15-indices-fks y hace checkout

# ... (implementar código) ...

# Crear PR
@github-flow crear-pr 15 feature/issue-15-indices-fks docs/plan-indices-fks.md
# → Devuelve: PR #27 creado en https://github.com/hispafox/AppTodoList/pull/27

# Comentar
@github-flow comentar-issue 15 "✅ PR creado: #27"
# → Añade comentario en issue #15
```

---

## Dependencias

- **MCP GitHub:** Las herramientas `mcp_github_mcp_se_*` deben estar disponibles
- **Git configurado:** Debes tener acceso al repositorio remoto
- **Rama main existente:** La rama base debe existir

---

## Notas

- El skill NO hace commit ni push — eso lo hace el orquestador
- El skill NO invoca al planificador/desarrollador/verificador — solo maneja GitHub
- Todas las operaciones validan el owner/repo antes de llamar a MCP
