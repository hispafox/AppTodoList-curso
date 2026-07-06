using AppTodoList.Data;
using AppTodoList.Models;
using Microsoft.EntityFrameworkCore;

namespace AppTodoList.LogicaNegocio;

public class PlantillaLogica : IPlantillaLogica
{
    private readonly AppDbContext _contexto;

    public PlantillaLogica(AppDbContext contexto)
    {
        _contexto = contexto;
    }

    public async Task<IEnumerable<PlantillaTarea>> ObtenerTodasAsync()
        => await _contexto.PlantillasTarea.ToListAsync();

    public async Task<PlantillaTarea?> ObtenerPorIdAsync(int id)
        => await _contexto.PlantillasTarea.FindAsync(id);

    public async Task<PlantillaTarea> CrearAsync(PlantillaTarea entidad)
    {
        _contexto.PlantillasTarea.Add(entidad);
        await _contexto.SaveChangesAsync();
        return entidad;
    }

    public async Task<PlantillaTarea?> ActualizarAsync(int id, PlantillaTarea entidad)
    {
        var existente = await _contexto.PlantillasTarea.FindAsync(id);
        if (existente is null)
            return null;

        existente.Titulo = entidad.Titulo;
        existente.EsRepetitiva = entidad.EsRepetitiva;
        existente.Recurrencia = entidad.Recurrencia;

        await _contexto.SaveChangesAsync();
        return existente;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var existente = await _contexto.PlantillasTarea.FindAsync(id);
        if (existente is null)
            return false;

        _contexto.PlantillasTarea.Remove(existente);
        await _contexto.SaveChangesAsync();
        return true;
    }

    public async Task<TodoItem?> InstanciarAsync(int id)
    {
        var plantilla = await _contexto.PlantillasTarea.FindAsync(id);
        if (plantilla is null)
            return null;

        var nuevaTarea = new TodoItem
        {
            Title = plantilla.Titulo,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            EsRepetitiva = plantilla.EsRepetitiva,
            Recurrencia = plantilla.Recurrencia,
            PlantillaId = plantilla.Id
        };

        _contexto.TodoItems.Add(nuevaTarea);
        await _contexto.SaveChangesAsync();
        return nuevaTarea;
    }
}
