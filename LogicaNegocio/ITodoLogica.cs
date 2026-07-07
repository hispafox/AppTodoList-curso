using AppTodoList.Models;

namespace AppTodoList.LogicaNegocio;

public interface ITodoLogica
{
    Task<IEnumerable<TodoItem>> ObtenerTodosAsync(int? categoriaId = null);
    Task<TodoItem?> ObtenerPorIdAsync(int id);
    Task<TodoItem> CrearAsync(TodoItem entidad);
    Task<TodoItem?> ActualizarAsync(int id, TodoItem entidad);
    Task<bool> EliminarAsync(int id);
    Task<TodoItem?> CompletarAsync(int id);
}
