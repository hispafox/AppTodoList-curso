using AppTodoList.Data;
using AppTodoList.Models;
using Microsoft.EntityFrameworkCore;

namespace AppTodoList.LogicaNegocio;

public class UsuarioAsignadoLogica : IUsuarioAsignadoLogica
{
    private readonly AppDbContext _contexto;

    public UsuarioAsignadoLogica(AppDbContext contexto)
    {
        _contexto = contexto;
    }

    public async Task<IEnumerable<UsuarioAsignado>> ObtenerTodosAsync()
        => await _contexto.UsuariosAsignados.ToListAsync();

    public async Task<UsuarioAsignado?> ObtenerPorIdAsync(int id)
        => await _contexto.UsuariosAsignados.FindAsync(id);

    public async Task<UsuarioAsignado> CrearAsync(UsuarioAsignado entidad)
    {
        _contexto.UsuariosAsignados.Add(entidad);
        await _contexto.SaveChangesAsync();
        return entidad;
    }

    public async Task<UsuarioAsignado?> ActualizarAsync(int id, UsuarioAsignado entidad)
    {
        var existente = await _contexto.UsuariosAsignados.FindAsync(id);
        if (existente is null)
            return null;

        existente.Nombre = entidad.Nombre;
        existente.Email = entidad.Email;

        await _contexto.SaveChangesAsync();
        return existente;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var existente = await _contexto.UsuariosAsignados.FindAsync(id);
        if (existente is null)
            return false;

        _contexto.UsuariosAsignados.Remove(existente);
        await _contexto.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExisteAsync(int id)
        => await _contexto.UsuariosAsignados.AnyAsync(u => u.Id == id);
}
