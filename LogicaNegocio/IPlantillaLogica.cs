using AppTodoList.Models;

namespace AppTodoList.LogicaNegocio;

public interface IPlantillaLogica
{
    Task<IEnumerable<PlantillaTarea>> ObtenerTodasAsync();
    Task<PlantillaTarea?> ObtenerPorIdAsync(int id);
    Task<PlantillaTarea> CrearAsync(PlantillaTarea entidad);
    Task<PlantillaTarea?> ActualizarAsync(int id, PlantillaTarea entidad);
    Task<bool> EliminarAsync(int id);
    Task<TodoItem?> InstanciarAsync(int id);
}
