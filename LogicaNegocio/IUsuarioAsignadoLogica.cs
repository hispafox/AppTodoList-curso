using AppTodoList.Models;

namespace AppTodoList.LogicaNegocio;

public interface IUsuarioAsignadoLogica
{
    Task<IEnumerable<UsuarioAsignado>> ObtenerTodosAsync();
    Task<UsuarioAsignado?> ObtenerPorIdAsync(int id);
    Task<UsuarioAsignado> CrearAsync(UsuarioAsignado entidad);
    Task<UsuarioAsignado?> ActualizarAsync(int id, UsuarioAsignado entidad);
    Task<bool> EliminarAsync(int id);
    Task<bool> ExisteAsync(int id);
}
