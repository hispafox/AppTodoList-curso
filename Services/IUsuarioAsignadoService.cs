using AppTodoList.Dtos;

namespace AppTodoList.Services;

public interface IUsuarioAsignadoService
{
    Task<IEnumerable<UsuarioAsignadoDto>> ObtenerTodosAsync();
    Task<UsuarioAsignadoDto?> ObtenerPorIdAsync(int id);
    Task<UsuarioAsignadoDto> CrearAsync(CrearUsuarioAsignadoDto dto);
    Task<UsuarioAsignadoDto?> ActualizarAsync(int id, ActualizarUsuarioAsignadoDto dto);
    Task<bool> EliminarAsync(int id);
}
