using AppTodoList.Dtos;

namespace AppTodoList.Services;

public interface ICategoriaService
{
    Task<IEnumerable<CategoriaDto>> ObtenerTodosAsync();
    Task<CategoriaDto?> ObtenerPorIdAsync(int id);
    Task<CategoriaDto> CrearAsync(CrearCategoriaDto dto);
    Task<CategoriaDto?> ActualizarAsync(int id, ActualizarCategoriaDto dto);
    Task<bool> EliminarAsync(int id);
}
