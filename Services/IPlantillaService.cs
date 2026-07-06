using AppTodoList.Dtos;

namespace AppTodoList.Services;

public interface IPlantillaService
{
    Task<IEnumerable<PlantillaDto>> ObtenerTodasAsync();
    Task<PlantillaDto?> ObtenerPorIdAsync(int id);
    Task<PlantillaDto> CrearAsync(CrearPlantillaDto dto);
    Task<PlantillaDto?> ActualizarAsync(int id, ActualizarPlantillaDto dto);
    Task<bool> EliminarAsync(int id);
    Task<TareaDto?> InstanciarAsync(int id);
}
