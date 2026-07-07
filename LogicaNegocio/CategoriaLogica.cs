using AppTodoList.Data;
using AppTodoList.Models;
using Microsoft.EntityFrameworkCore;

namespace AppTodoList.LogicaNegocio;

public class CategoriaLogica : ICategoriaLogica
{
    private readonly AppDbContext _contexto;

    public CategoriaLogica(AppDbContext contexto)
    {
        _contexto = contexto;
    }

    public async Task<IEnumerable<Categoria>> ObtenerTodosAsync()
        => await _contexto.Categorias.ToListAsync();

    public async Task<Categoria?> ObtenerPorIdAsync(int id)
        => await _contexto.Categorias.FindAsync(id);

    public async Task<Categoria> CrearAsync(Categoria entidad)
    {
        _contexto.Categorias.Add(entidad);
        await _contexto.SaveChangesAsync();
        return entidad;
    }

    public async Task<Categoria?> ActualizarAsync(int id, Categoria entidad)
    {
        var existente = await _contexto.Categorias.FindAsync(id);
        if (existente is null)
            return null;

        existente.Nombre = entidad.Nombre;
        existente.Color = entidad.Color;

        await _contexto.SaveChangesAsync();
        return existente;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var existente = await _contexto.Categorias.FindAsync(id);
        if (existente is null)
            return false;

        // Validación: no se puede eliminar una categoría con tareas asociadas
        var tieneTareasAsociadas = await _contexto.TodoItems
            .AnyAsync(t => t.CategoriaId == id);

        if (tieneTareasAsociadas)
            throw new InvalidOperationException(
                $"No se puede eliminar la categoría con Id {id} porque tiene tareas asociadas.");

        _contexto.Categorias.Remove(existente);
        await _contexto.SaveChangesAsync();
        return true;
    }
}
