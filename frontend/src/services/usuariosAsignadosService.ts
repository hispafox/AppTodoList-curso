import { fetchApi } from './api';
import type { UsuarioAsignadoDto, CrearUsuarioAsignadoDto, ActualizarUsuarioAsignadoDto } from '../types';

export const usuariosAsignadosService = {
  obtenerTodos: async (): Promise<UsuarioAsignadoDto[]> => {
    return fetchApi<UsuarioAsignadoDto[]>('/api/usuariosasignados');
  },

  obtenerPorId: async (id: number): Promise<UsuarioAsignadoDto> => {
    return fetchApi<UsuarioAsignadoDto>(`/api/usuariosasignados/${id}`);
  },

  crear: async (dto: CrearUsuarioAsignadoDto): Promise<UsuarioAsignadoDto> => {
    return fetchApi<UsuarioAsignadoDto>('/api/usuariosasignados', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  },

  actualizar: async (id: number, dto: ActualizarUsuarioAsignadoDto): Promise<UsuarioAsignadoDto> => {
    return fetchApi<UsuarioAsignadoDto>(`/api/usuariosasignados/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto)
    });
  },

  eliminar: async (id: number): Promise<void> => {
    return fetchApi<void>(`/api/usuariosasignados/${id}`, {
      method: 'DELETE'
    });
  }
};
