# Plan: Frontend completo React + Vite + TypeScript

> Generado por el agente planificador · 2026-06-25

## 1. Resumen

Implementar el frontend completo de la aplicación de gestión de tareas usando React, Vite y TypeScript. El frontend debe consumir todos los endpoints del backend existente (Tareas, Categorías, Plantillas, Usuarios Asignados), proporcionar navegación entre secciones, y ofrecer CRUD completo para todas las entidades con una interfaz de usuario moderna y responsiva.

## 2. Requisitos funcionales

1. El usuario debe poder listar, crear, editar y eliminar tareas desde la página principal
2. El usuario debe poder marcar una tarea como completada
3. El usuario debe poder filtrar las tareas por categoría
4. El usuario debe poder ver la categoría, usuario asignado y recurrencia de cada tarea
5. El usuario debe poder navegar a las secciones de Categorías, Plantillas y Usuarios Asignados
6. El usuario debe poder gestionar (CRUD completo) categorías con nombre y color
7. El usuario debe poder gestionar (CRUD completo) plantillas de tareas
8. El usuario debe poder instanciar una tarea desde una plantilla
9. El usuario debe poder gestionar (CRUD completo) usuarios asignados
10. El usuario debe poder asignar una categoría y un usuario a una tarea al crearla o editarla
11. La aplicación debe mostrar mensajes de error amigables cuando las operaciones fallen
12. La aplicación debe confirmar las eliminaciones antes de ejecutarlas

## 3. Cambios en el modelo de datos

### Entidades nuevas o modificadas

No hay cambios en el modelo de datos del backend. El frontend consume las entidades existentes:

| Entidad | Descripción |
|---------|-------------|
| TareaDto | Tarea con título, estado de completado, fecha de creación, recurrencia, categoría, usuario asignado |
| CategoriaDto | Categoría con nombre y color hexadecimal |
| PlantillaDto | Plantilla de tarea con título, flag de repetitiva y tipo de recurrencia |
| UsuarioAsignadoDto | Usuario con nombre y email |
| TipoRecurrencia | Enum con valores: Diaria, Semanal, Mensual |

### Migración necesaria

No aplica — el backend ya está implementado con migraciones completas.

## 4. DTOs

### Tipos TypeScript (traducción de DTOs C# → TypeScript)

```typescript
// frontend/src/types/index.ts

export enum TipoRecurrencia {
  Diaria = 'Diaria',
  Semanal = 'Semanal',
  Mensual = 'Mensual'
}

export interface TareaDto {
  id: number;
  title: string;
  isCompleted: boolean;
  createdAt: string; // formato ISO 8601
  esRepetitiva: boolean;
  recurrencia: TipoRecurrencia | null;
  proximaFecha: string | null; // formato ISO 8601
  plantillaId: number | null;
  usuarioAsignadoId: number | null;
  categoriaId: number | null;
  categoriaNombre: string | null;
  usuarioAsignadoNombre: string | null;
}

export interface CrearTareaDto {
  title: string;
  esRepetitiva?: boolean;
  recurrencia?: TipoRecurrencia | null;
  plantillaId?: number | null;
  usuarioAsignadoId?: number | null;
  categoriaId?: number | null;
}

export interface ActualizarTareaDto {
  title: string;
  isCompleted?: boolean;
  esRepetitiva?: boolean;
  recurrencia?: TipoRecurrencia | null;
  usuarioAsignadoId?: number | null;
  categoriaId?: number | null;
}

export interface CategoriaDto {
  id: number;
  nombre: string;
  color: string; // formato #RRGGBB
}

export interface CrearCategoriaDto {
  nombre: string;
  color: string;
}

export interface ActualizarCategoriaDto {
  nombre: string;
  color: string;
}

export interface PlantillaDto {
  id: number;
  titulo: string;
  esRepetitiva: boolean;
  recurrencia: TipoRecurrencia | null;
}

export interface CrearPlantillaDto {
  titulo: string;
  esRepetitiva?: boolean;
  recurrencia?: TipoRecurrencia | null;
}

export interface ActualizarPlantillaDto {
  titulo: string;
  esRepetitiva?: boolean;
  recurrencia?: TipoRecurrencia | null;
}

export interface UsuarioAsignadoDto {
  id: number;
  nombre: string;
  email: string;
}

export interface CrearUsuarioAsignadoDto {
  nombre: string;
  email: string;
}

export interface ActualizarUsuarioAsignadoDto {
  nombre: string;
  email: string;
}
```

## 5. Endpoints

### API REST consumida por el frontend

| Recurso | Verbo | Ruta | Cuerpo | Respuesta exitosa | Errores posibles |
|---------|-------|------|--------|-------------------|------------------|
| **Tareas** | GET | `/api/tareas` | — | `200` + `TareaDto[]` | — |
| | GET | `/api/tareas?categoriaId={id}` | — | `200` + `TareaDto[]` | — |
| | GET | `/api/tareas/{id}` | — | `200` + `TareaDto` | `404` |
| | POST | `/api/tareas` | `CrearTareaDto` | `201` + `TareaDto` | `400` |
| | PUT | `/api/tareas/{id}` | `ActualizarTareaDto` | `200` + `TareaDto` | `400`, `404` |
| | DELETE | `/api/tareas/{id}` | — | `204` | `404` |
| | POST | `/api/tareas/{id}/completar` | — | `200` + `TareaDto` | `404` |
| **Categorías** | GET | `/api/categorias` | — | `200` + `CategoriaDto[]` | — |
| | GET | `/api/categorias/{id}` | — | `200` + `CategoriaDto` | `404` |
| | POST | `/api/categorias` | `CrearCategoriaDto` | `201` + `CategoriaDto` | `400` |
| | PUT | `/api/categorias/{id}` | `ActualizarCategoriaDto` | `200` + `CategoriaDto` | `400`, `404` |
| | DELETE | `/api/categorias/{id}` | — | `204` | `400` (si tiene tareas), `404` |
| **Plantillas** | GET | `/api/plantillas` | — | `200` + `PlantillaDto[]` | — |
| | GET | `/api/plantillas/{id}` | — | `200` + `PlantillaDto` | `404` |
| | POST | `/api/plantillas` | `CrearPlantillaDto` | `201` + `PlantillaDto` | `400` |
| | PUT | `/api/plantillas/{id}` | `ActualizarPlantillaDto` | `200` + `PlantillaDto` | `400`, `404` |
| | DELETE | `/api/plantillas/{id}` | — | `204` | `404` |
| | POST | `/api/plantillas/{id}/instanciar` | — | `201` + `TareaDto` | `404` |
| **Usuarios** | GET | `/api/usuariosasignados` | — | `200` + `UsuarioAsignadoDto[]` | — |
| | GET | `/api/usuariosasignados/{id}` | — | `200` + `UsuarioAsignadoDto` | `404` |
| | POST | `/api/usuariosasignados` | `CrearUsuarioAsignadoDto` | `201` + `UsuarioAsignadoDto` | `400` |
| | PUT | `/api/usuariosasignados/{id}` | `ActualizarUsuarioAsignadoDto` | `200` + `UsuarioAsignadoDto` | `400`, `404` |
| | DELETE | `/api/usuariosasignados/{id}` | — | `204` | `404` |

## 6. Lógica de negocio

La lógica de negocio reside en el backend. El frontend solo:

1. **Valida formato de entrada en el cliente** — campos requeridos, formato de email, longitud máxima
2. **Formatea fechas** — convierte ISO 8601 a formato legible para el usuario
3. **Gestiona estado local** — lista de tareas, categorías, plantillas y usuarios en memoria
4. **Maneja errores HTTP** — muestra mensajes amigables cuando el backend responde con error
5. **Confirma eliminaciones** — pregunta al usuario antes de enviar DELETE al backend
6. **Actualiza UI optimistamente** — refleja cambios de forma inmediata tras llamadas exitosas al backend

## 7. Capas afectadas

### Crear:

**Configuración raíz del proyecto frontend:**
- `frontend/package.json` — dependencias: react, react-dom, react-router-dom, typescript, vite, @vitejs/plugin-react
- `frontend/vite.config.ts` — configuración de proxy hacia el backend `https://localhost:5001` con `secure: false`
- `frontend/tsconfig.json` — configuración TypeScript estricta
- `frontend/index.html` — punto de entrada HTML

**Tipos TypeScript:**
- `frontend/src/types/index.ts` — tipos de datos (traducción de DTOs C# a TypeScript)

**Servicios de API (fetch):**
- `frontend/src/services/api.ts` — cliente HTTP base con manejo de errores
- `frontend/src/services/tareasService.ts` — CRUD + completar + filtrar por categoría
- `frontend/src/services/categoriasService.ts` — CRUD de categorías
- `frontend/src/services/plantillasService.ts` — CRUD + instanciar
- `frontend/src/services/usuariosAsignadosService.ts` — CRUD de usuarios asignados

**Componentes compartidos:**
- `frontend/src/components/Layout.tsx` — navegación principal con links a todas las secciones
- `frontend/src/components/ErrorMessage.tsx` — componente para mostrar mensajes de error
- `frontend/src/components/ConfirmDialog.tsx` — diálogo de confirmación para eliminaciones

**Páginas:**
- `frontend/src/pages/TareasPage.tsx` — lista de tareas, formulario crear/editar, botón completar, filtro por categoría
- `frontend/src/pages/CategoriasPage.tsx` — lista de categorías con preview de color, formulario crear/editar con selector de color
- `frontend/src/pages/PlantillasPage.tsx` — lista de plantillas, formulario crear/editar, botón instanciar
- `frontend/src/pages/UsuariosAsignadosPage.tsx` — lista de usuarios, formulario crear/editar

**Punto de entrada y enrutamiento:**
- `frontend/src/main.tsx` — punto de entrada React
- `frontend/src/App.tsx` — definición de rutas con react-router-dom

**Estilos:**
- `frontend/src/index.css` — estilos globales básicos (reset + variables CSS)

### Modificar:

No aplica — el frontend es nuevo y no modifica archivos existentes del backend.

## 8. Tests unitarios a implementar

Dado el carácter didáctico del proyecto, los tests del frontend son opcionales. Si se implementan:

- `frontend/src/services/__tests__/tareasService.test.ts`: verificar que las llamadas fetch se construyen correctamente
- `frontend/src/components/__tests__/Layout.test.tsx`: verificar que los links de navegación se renderizan
- `frontend/src/pages/__tests__/TareasPage.test.tsx`: verificar que se muestra la lista de tareas y el formulario

Para simplificar la demo, **no se incluyen tests en el plan inicial**. Pueden añadirse más adelante si el curso lo requiere.

## 9. Criterios de aceptación

1. ✅ El proyecto frontend arranca con `npm run dev` sin errores
2. ✅ El proxy de Vite redirige correctamente las peticiones a `https://localhost:5001`
3. ✅ La página principal (`/`) muestra la lista de tareas cargada desde el backend
4. ✅ Se puede crear, editar y eliminar tareas desde la UI
5. ✅ Al marcar una tarea como completada, el botón "Completar" invoca el endpoint correcto
6. ✅ El filtro por categoría funciona y actualiza la lista de tareas
7. ✅ La navegación entre secciones (Tareas / Categorías / Plantillas / Usuarios) funciona correctamente
8. ✅ Se puede crear, editar y eliminar categorías con selector de color visual
9. ✅ Se puede crear, editar y eliminar plantillas
10. ✅ El botón "Instanciar" de una plantilla crea una nueva tarea y redirige a la página de tareas
11. ✅ Se puede crear, editar y eliminar usuarios asignados
12. ✅ Al crear o editar una tarea, se puede seleccionar categoría, usuario asignado y tipo de recurrencia desde dropdowns
13. ✅ Los errores del backend (400, 404, 500) se muestran con mensajes amigables en la UI
14. ✅ Las eliminaciones muestran un diálogo de confirmación antes de ejecutarse

## 10. Skills a invocar

Basándote en las capas afectadas (sección 7), indica qué skills del catálogo de
`docs/skills-orquestacion.md` hay que ejecutar para implementar esta feature y en qué orden.
Respeta siempre la cadena de dependencias definida en ese documento.

> Para ejecutar toda la cadena de una vez, usa el skill orquestador: `nueva-feature`.
> Para ejecutar skills individuales, llámalos en el orden indicado a continuación.

| Orden | Skill | Motivo (qué genera para esta feature) |
|-------|-------|---------------------------------------|
| 1 | `diseño-analisis` | **N/A** — El documento de análisis y diseño ya incluye el modelo de datos y endpoints existentes. No hay cambios en el backend. |
| 2 | `modelo` | **N/A** — No se crean ni modifican entidades de dominio. El frontend consume los modelos existentes. |
| 3 | `dto` | **N/A** — No se crean ni modifican DTOs en el backend. El frontend define sus propios tipos TypeScript equivalentes. |
| 4 | `base-de-datos` | **N/A** — No hay cambios en `AppDbContext` ni migraciones. El backend ya está completo. |
| 5 | `logica-negocio` | **N/A** — No se añade lógica de negocio. El frontend solo consume endpoints REST existentes. |
| 6 | `validaciones` | **N/A** — Las validaciones del backend ya están implementadas. El frontend solo valida formato de entrada en el cliente. |
| 7 | `servicio` | **N/A** — No se crean ni modifican servicios en el backend. El frontend crea sus propios servicios fetch en TypeScript. |
| 8 | `controlador` | **N/A** — No se crean ni modifican controladores. El frontend consume los controladores ya implementados. |
| 9 | `ui-ux-pro-max` | **SÍ** — Consultar patrones UI/UX, heurísticas de usabilidad y mejores prácticas antes de implementar componentes React. Validar diseño de formularios, navegación, feedback de errores, confirmaciones, accesibilidad y experiencia de usuario. |
| 10 | `frontend-react` | **SÍ** — Crear el proyecto Vite, tipos TypeScript, servicios fetch, componentes, páginas y configuración de rutas. Implementar toda la UI del frontend según lo especificado en este plan. |
| 11 | `commit-message` | **SÍ** — Generar el mensaje de commit al finalizar la implementación completa del frontend. |

---

## Notas de implementación

### Configuración del proxy Vite

El backend ASP.NET Core usa HTTPS con el certificado de desarrollo de .NET (`https://localhost:5001`). El proxy de Vite debe configurarse con `secure: false` para evitar errores de certificado auto-firmado:

```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

### Estructura de carpetas frontend

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── ConfirmDialog.tsx
│   ├── pages/
│   │   ├── TareasPage.tsx
│   │   ├── CategoriasPage.tsx
│   │   ├── PlantillasPage.tsx
│   │   └── UsuariosAsignadosPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── tareasService.ts
│   │   ├── categoriasService.ts
│   │   ├── plantillasService.ts
│   │   └── usuariosAsignadosService.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Dependencias principales (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2",
    "vite": "^6.0.5"
  }
}
```

### Servicios fetch — patrón común

Todos los servicios comparten el mismo patrón:

1. Cliente HTTP base (`api.ts`) con función `fetchApi()` que maneja errores HTTP y convierte la respuesta a JSON
2. Cada servicio de recurso (`tareasService.ts`, `categoriasService.ts`, etc.) exporta funciones async para cada operación CRUD
3. Los errores se propagan como excepciones que capturan los componentes y muestran con `ErrorMessage`

Ejemplo de estructura de servicio:

```typescript
// frontend/src/services/tareasService.ts
import { fetchApi } from './api';
import type { TareaDto, CrearTareaDto, ActualizarTareaDto } from '../types';

export const tareasService = {
  obtenerTodas: async (categoriaId?: number): Promise<TareaDto[]> => {
    const query = categoriaId ? `?categoriaId=${categoriaId}` : '';
    return fetchApi<TareaDto[]>(`/api/tareas${query}`);
  },

  obtenerPorId: async (id: number): Promise<TareaDto> => {
    return fetchApi<TareaDto>(`/api/tareas/${id}`);
  },

  crear: async (dto: CrearTareaDto): Promise<TareaDto> => {
    return fetchApi<TareaDto>('/api/tareas', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  },

  actualizar: async (id: number, dto: ActualizarTareaDto): Promise<TareaDto> => {
    return fetchApi<TareaDto>(`/api/tareas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto)
    });
  },

  eliminar: async (id: number): Promise<void> => {
    return fetchApi<void>(`/api/tareas/${id}`, {
      method: 'DELETE'
    });
  },

  completar: async (id: number): Promise<TareaDto> => {
    return fetchApi<TareaDto>(`/api/tareas/${id}/completar`, {
      method: 'POST'
    });
  }
};
```

### Componentes principales — responsabilidades

| Componente | Responsabilidad |
|---|---|
| `Layout.tsx` | Navbar con links a Tareas / Categorías / Plantillas / Usuarios + `<Outlet />` para renderizar la página activa |
| `ErrorMessage.tsx` | Muestra un mensaje de error con estilos (rojo, icono de alerta) |
| `ConfirmDialog.tsx` | Diálogo modal que pregunta "¿Estás seguro?" antes de eliminar un recurso |
| `TareasPage.tsx` | Lista de tareas + formulario crear/editar + botón completar + filtro por categoría + selectores de categoría/usuario |
| `CategoriasPage.tsx` | Lista de categorías con badge de color + formulario crear/editar con input type="color" |
| `PlantillasPage.tsx` | Lista de plantillas + formulario crear/editar + botón instanciar |
| `UsuariosAsignadosPage.tsx` | Lista de usuarios + formulario crear/editar con validación de email |

### Estado y hooks

Cada página gestiona su propio estado local con `useState`:

- Lista de recursos (`tareas`, `categorias`, `plantillas`, `usuarios`)
- Formulario de edición (`tarea editando`, `categoria editando`, etc.)
- Modo de formulario (`'crear' | 'editar'`)
- Mensaje de error (`error: string | null`)
- Loading state opcional (`isLoading: boolean`)

Se usa `useEffect` con array vacío `[]` para cargar la lista al montar el componente.

### Navegación

React Router gestiona las rutas:

```typescript
// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TareasPage from './pages/TareasPage';
import CategoriasPage from './pages/CategoriasPage';
import PlantillasPage from './pages/PlantillasPage';
import UsuariosAsignadosPage from './pages/UsuariosAsignadosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TareasPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="plantillas" element={<PlantillasPage />} />
          <Route path="usuarios" element={<UsuariosAsignadosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Estilos

Se usa CSS puro con variables CSS para mantener la simplicidad didáctica. No se añaden bibliotecas de componentes (Material UI, Ant Design, etc.) a menos que el usuario lo solicite explícitamente.

Variables CSS recomendadas:

```css
/* frontend/src/index.css */
:root {
  --color-primary: #3b82f6;
  --color-danger: #ef4444;
  --color-success: #10b981;
  --color-bg: #f9fafb;
  --color-text: #1f2937;
  --border-radius: 8px;
  --spacing-unit: 8px;
}
```

### Gestión de errores

El cliente HTTP base (`api.ts`) lanza excepciones cuando la respuesta no es `ok`:

```typescript
// frontend/src/services/api.ts
export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Error ${response.status}: ${response.statusText}`);
  }

  // Si es DELETE 204, no hay cuerpo JSON
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
```

Los componentes capturan las excepciones en bloques `try/catch` y actualizan el estado de error:

```typescript
const handleCrear = async () => {
  try {
    setError(null);
    const nuevaTarea = await tareasService.crear({ title: titulo });
    setTareas([...tareas, nuevaTarea]);
    setTitulo('');
  } catch (err) {
    setError((err as Error).message);
  }
};
```

---

## Anexo: Wireframes de referencia (opcional)

Si el curso lo requiere, se pueden añadir wireframes o mockups de las páginas principales. Por ahora, la descripción textual es suficiente para la implementación.

### TareasPage (página principal)

- **Encabezado**: "Gestión de Tareas"
- **Filtro**: Dropdown "Filtrar por categoría" (Todas / categoría 1 / categoría 2 / ...)
- **Lista de tareas**: Tabla o lista vertical con columnas:
  - Título
  - Estado (completada / pendiente con checkbox)
  - Categoría (badge con color)
  - Usuario asignado
  - Fecha de creación
  - Próxima fecha (si es repetitiva)
  - Acciones: Editar | Eliminar | Completar
- **Formulario crear/editar**: Campos:
  - Título (input text)
  - Es repetitiva (checkbox)
  - Recurrencia (dropdown: Diaria / Semanal / Mensual) — solo visible si es repetitiva
  - Categoría (dropdown con todas las categorías)
  - Usuario asignado (dropdown con todos los usuarios)
  - Botones: Guardar | Cancelar

### CategoriasPage

- **Encabezado**: "Gestión de Categorías"
- **Lista de categorías**: Tabla con columnas:
  - Nombre
  - Color (badge visual con el color hex)
  - Acciones: Editar | Eliminar
- **Formulario crear/editar**: Campos:
  - Nombre (input text)
  - Color (input type="color" con preview)
  - Botones: Guardar | Cancelar

### PlantillasPage

- **Encabezado**: "Gestión de Plantillas"
- **Lista de plantillas**: Tabla con columnas:
  - Título
  - Es repetitiva (Sí / No)
  - Recurrencia
  - Acciones: Editar | Eliminar | Instanciar
- **Formulario crear/editar**: Campos:
  - Título (input text)
  - Es repetitiva (checkbox)
  - Recurrencia (dropdown: Diaria / Semanal / Mensual) — solo visible si es repetitiva
  - Botones: Guardar | Cancelar

### UsuariosAsignadosPage

- **Encabezado**: "Gestión de Usuarios Asignados"
- **Lista de usuarios**: Tabla con columnas:
  - Nombre
  - Email
  - Acciones: Editar | Eliminar
- **Formulario crear/editar**: Campos:
  - Nombre (input text)
  - Email (input email con validación)
  - Botones: Guardar | Cancelar
