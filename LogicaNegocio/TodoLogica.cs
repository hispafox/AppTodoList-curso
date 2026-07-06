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

    public async Task<IEnumerable<TodoItem>> ObtenerTodosAsync()
        => await _contexto.TodoItems.ToListAsync();

    public async Task<TodoItem?> ObtenerPorIdAsync(int id)
        => await _contexto.TodoItems.FindAsync(id);

    public async Task<TodoItem> CrearAsync(TodoItem entidad)
    {
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

        existente.Title = entidad.Title;
        existente.IsCompleted = entidad.IsCompleted;
        existente.EsRepetitiva = entidad.EsRepetitiva;
        existente.Recurrencia = entidad.Recurrencia;

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

        tarea.IsCompleted = true;

        TodoItem resultado = tarea;

        if (tarea.EsRepetitiva && tarea.Recurrencia.HasValue)
        {
            var proximaFecha = CalcularProximaFecha(DateTime.UtcNow, tarea.Recurrencia.Value);
            var nuevaTarea = new TodoItem
            {
                Title = tarea.Title,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                EsRepetitiva = true,
                Recurrencia = tarea.Recurrencia,
                ProximaFecha = proximaFecha,
                PlantillaId = tarea.PlantillaId
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
