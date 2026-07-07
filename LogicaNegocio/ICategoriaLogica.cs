using AppTodoList.Models;

namespace AppTodoList.LogicaNegocio;

public interface ICategoriaLogica
{
    Task<IEnumerable<Categoria>> ObtenerTodosAsync();
    Task<Categoria?> ObtenerPorIdAsync(int id);
    Task<Categoria> CrearAsync(Categoria entidad);
    Task<Categoria?> ActualizarAsync(int id, Categoria entidad);
    Task<bool> EliminarAsync(int id);
}
