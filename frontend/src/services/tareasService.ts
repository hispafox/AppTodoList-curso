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
