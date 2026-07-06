using AppTodoList.Models;

namespace AppTodoList.Data;

public static class DatosEjemplo
{
    public static void Inicializar(AppDbContext contexto)
    {
        if (contexto.TodoItems.Any())
            return; // Ya hay datos, no insertar duplicados

        contexto.TodoItems.AddRange(
            new TodoItem { Title = "Ejemplo 1", CreatedAt = DateTime.UtcNow },
            new TodoItem { Title = "Ejemplo 2", CreatedAt = DateTime.UtcNow }
        );
        contexto.SaveChanges();
    }
}
