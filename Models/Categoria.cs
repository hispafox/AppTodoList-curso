namespace AppTodoList.Models;

public class Categoria
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public ICollection<TodoItem> Tareas { get; set; } = new List<TodoItem>();
}
