import { fetchApi } from './api';
import type { CategoriaDto, CrearCategoriaDto, ActualizarCategoriaDto } from '../types';

export const categoriasService = {
  obtenerTodas: async (): Promise<CategoriaDto[]> => {
    return fetchApi<CategoriaDto[]>('/api/categorias');
  },

  obtenerPorId: async (id: number): Promise<CategoriaDto> => {
    return fetchApi<CategoriaDto>(`/api/categorias/${id}`);
  },

  crear: async (dto: CrearCategoriaDto): Promise<CategoriaDto> => {
    return fetchApi<CategoriaDto>('/api/categorias', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  },

  actualizar: async (id: number, dto: ActualizarCategoriaDto): Promise<CategoriaDto> => {
    return fetchApi<CategoriaDto>(`/api/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto)
    });
  },

  eliminar: async (id: number): Promise<void> => {
    return fetchApi<void>(`/api/categorias/${id}`, {
      method: 'DELETE'
    });
  }
};
