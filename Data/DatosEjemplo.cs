using AppTodoList.Models;

namespace AppTodoList.Data;

public static class DatosEjemplo
{
    public static void Inicializar(AppDbContext contexto)
    {
        SeedUsuarios(contexto);
        SeedTareas(contexto);
    }

    private static void SeedUsuarios(AppDbContext contexto)
    {
        if (contexto.UsuariosAsignados.Any())
            return;

        contexto.UsuariosAsignados.AddRange(
            new UsuarioAsignado { Nombre = "Ana García",   Email = "ana@demo.com"    },
            new UsuarioAsignado { Nombre = "Carlos López", Email = "carlos@demo.com" }
        );
        contexto.SaveChanges();
    }

    private static void SeedTareas(AppDbContext contexto)
    {
        if (contexto.TodoItems.Any())
            return; // Ya hay datos, no insertar duplicados

        var ana = contexto.UsuariosAsignados.First(u => u.Email == "ana@demo.com");

        contexto.TodoItems.AddRange(
            new TodoItem { Title = "Ejemplo 1", CreatedAt = DateTime.UtcNow, UsuarioAsignadoId = ana.Id },
            new TodoItem { Title = "Ejemplo 2", CreatedAt = DateTime.UtcNow }
        );
        contexto.SaveChanges();
    }
}
