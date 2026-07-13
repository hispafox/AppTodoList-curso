// Tipos
export type TipoRecurrencia = 'Diaria' | 'Semanal' | 'Mensual';

// Tareas
export interface TareaDto {
  id: number;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  esRepetitiva: boolean;
  recurrencia: TipoRecurrencia | null;
  proximaFecha: string | null;
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

// Categorías
export interface CategoriaDto {
  id: number;
  nombre: string;
  color: string;
}

export interface CrearCategoriaDto {
  nombre: string;
  color: string;
}

export interface ActualizarCategoriaDto {
  nombre: string;
  color: string;
}

// Plantillas
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

// Usuarios Asignados
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
