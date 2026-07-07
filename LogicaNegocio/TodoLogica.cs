using AppTodoList.Data;
using AppTodoList.Models;
using Microsoft.EntityFrameworkCore;

namespace AppTodoList.LogicaNegocio;

public class TodoLogica : ITodoLogica
{
    private readonly AppDbContext _contexto;

    public TodoLogica(AppDbContext contexto)
    {
        _contexto = contexto;
    }

    public async Task<IEnumerable<TodoItem>> ObtenerTodosAsync(int? categoriaId = null)
    {
        var query = _contexto.TodoItems
            .Include(t => t.UsuarioAsignado)
            .Include(t => t.Categoria)
            .AsQueryable();

        if (categoriaId.HasValue)
            query = query.Where(t => t.CategoriaId == categoriaId.Value);

        return await query.ToListAsync();
    }

    public async Task<TodoItem?> ObtenerPorIdAsync(int id)
        => await _contexto.TodoItems
            .Include(t => t.UsuarioAsignado)
            .Include(t => t.Categoria)
            .FirstOrDefaultAsync(t => t.Id == id);

    public async Task<TodoItem> CrearAsync(TodoItem entidad)
    {
        if (entidad.UsuarioAsignadoId.HasValue &&
            !await _contexto.UsuariosAsignados.AnyAsync(u => u.Id == entidad.UsuarioAsignadoId.Value))
            throw new ArgumentException($"No existe el usuario asignado con Id {entidad.UsuarioAsignadoId}.");

        entidad.CreatedAt = DateTime.UtcNow;
        _contexto.TodoItems.Add(entidad);
        await _contexto.SaveChangesAsync();
        return entidad;
    }

    public async Task<TodoItem?> ActualizarAsync(int id, TodoItem entidad)
    {
        var existente = await _contexto.TodoItems.FindAsync(id);
        if (existente is null)
            return null;

        if (entidad.UsuarioAsignadoId.HasValue &&
            !await _contexto.UsuariosAsignados.AnyAsync(u => u.Id == entidad.UsuarioAsignadoId.Value))
            throw new ArgumentException($"No existe el usuario asignado con Id {entidad.UsuarioAsignadoId}.");

        existente.Title = entidad.Title;
        existente.IsCompleted = entidad.IsCompleted;
        existente.EsRepetitiva = entidad.EsRepetitiva;
        existente.Recurrencia = entidad.Recurrencia;
        existente.UsuarioAsignadoId = entidad.UsuarioAsignadoId;

        await _contexto.SaveChangesAsync();
        return existente;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var existente = await _contexto.TodoItems.FindAsync(id);
        if (existente is null)
            return false;

        _contexto.TodoItems.Remove(existente);
        await _contexto.SaveChangesAsync();
        return true;
    }

    public async Task<TodoItem?> CompletarAsync(int id)
    {
        var tarea = await _contexto.TodoItems.FindAsync(id);
        if (tarea is null)
            return null;

        if (tarea.IsCompleted)
            throw new InvalidOperationException("La tarea ya está completada");

        tarea.IsCompleted = true;

        TodoItem resultado = tarea;

        if (tarea.EsRepetitiva && tarea.Recurrencia.HasValue)
        {
            var proximaFecha = CalcularProximaFecha(DateTime.UtcNow, tarea.Recurrencia.Value);
            var nuevaTarea = new TodoItem
            {
                Title              = tarea.Title,
                IsCompleted        = false,
                CreatedAt          = DateTime.UtcNow,
                EsRepetitiva       = true,
                Recurrencia        = tarea.Recurrencia,
                ProximaFecha       = proximaFecha,
                PlantillaId        = tarea.PlantillaId,
                UsuarioAsignadoId  = tarea.UsuarioAsignadoId,
                CategoriaId        = tarea.CategoriaId
            };
            _contexto.TodoItems.Add(nuevaTarea);
            resultado = nuevaTarea;
        }

        await _contexto.SaveChangesAsync();
        return resultado;
    }

    private static DateTime CalcularProximaFecha(DateTime desde, TipoRecurrencia recurrencia)
        => recurrencia switch
        {
            TipoRecurrencia.Diaria   => desde.AddDays(1),
            TipoRecurrencia.Semanal  => desde.AddDays(7),
            TipoRecurrencia.Mensual  => desde.AddMonths(1),
            _                        => desde.AddDays(1)
        };
}
