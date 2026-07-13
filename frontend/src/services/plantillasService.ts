import { fetchApi } from './api';
import type { PlantillaDto, CrearPlantillaDto, ActualizarPlantillaDto, TareaDto } from '../types';

export const plantillasService = {
  obtenerTodas: async (): Promise<PlantillaDto[]> => {
    return fetchApi<PlantillaDto[]>('/api/plantillas');
  },

  obtenerPorId: async (id: number): Promise<PlantillaDto> => {
    return fetchApi<PlantillaDto>(`/api/plantillas/${id}`);
  },

  crear: async (dto: CrearPlantillaDto): Promise<PlantillaDto> => {
    return fetchApi<PlantillaDto>('/api/plantillas', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  },

  actualizar: async (id: number, dto: ActualizarPlantillaDto): Promise<PlantillaDto> => {
    return fetchApi<PlantillaDto>(`/api/plantillas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto)
    });
  },

  eliminar: async (id: number): Promise<void> => {
    return fetchApi<void>(`/api/plantillas/${id}`, {
      method: 'DELETE'
    });
  },

  instanciar: async (id: number): Promise<TareaDto> => {
    return fetchApi<TareaDto>(`/api/plantillas/${id}/instanciar`, {
      method: 'POST'
    });
  }
};
