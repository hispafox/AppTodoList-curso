using AppTodoList.Dtos;

namespace AppTodoList.Services;

public interface ITodoService
{
    Task<IEnumerable<TareaDto>> ObtenerTodosAsync();
    Task<TareaDto?> ObtenerPorIdAsync(int id);
    Task<TareaDto> CrearAsync(CrearTareaDto dto);
    Task<TareaDto?> ActualizarAsync(int id, ActualizarTareaDto dto);
    Task<bool> EliminarAsync(int id);
    Task<TareaDto?> CompletarAsync(int id);
}
