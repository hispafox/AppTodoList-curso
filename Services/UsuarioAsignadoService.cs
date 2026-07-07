using AppTodoList.Dtos;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;

namespace AppTodoList.Services;

public class UsuarioAsignadoService : IUsuarioAsignadoService
{
    private readonly IUsuarioAsignadoLogica _logica;

    public UsuarioAsignadoService(IUsuarioAsignadoLogica logica)
    {
        _logica = logica;
    }

    public async Task<IEnumerable<UsuarioAsignadoDto>> ObtenerTodosAsync()
    {
        var entidades = await _logica.ObtenerTodosAsync();
        return entidades.Select(MapearADto);
    }

    public async Task<UsuarioAsignadoDto?> ObtenerPorIdAsync(int id)
    {
        var entidad = await _logica.ObtenerPorIdAsync(id);
        return entidad is null ? null : MapearADto(entidad);
    }

    public async Task<UsuarioAsignadoDto> CrearAsync(CrearUsuarioAsignadoDto dto)
    {
        var entidad = new UsuarioAsignado
        {
            Nombre = dto.Nombre,
            Email  = dto.Email
        };
        var creado = await _logica.CrearAsync(entidad);
        return MapearADto(creado);
    }

    public async Task<UsuarioAsignadoDto?> ActualizarAsync(int id, ActualizarUsuarioAsignadoDto dto)
    {
        var entidad = new UsuarioAsignado
        {
            Nombre = dto.Nombre,
            Email  = dto.Email
        };
        var actualizado = await _logica.ActualizarAsync(id, entidad);
        return actualizado is null ? null : MapearADto(actualizado);
    }

    public async Task<bool> EliminarAsync(int id)
        => await _logica.EliminarAsync(id);

    private static UsuarioAsignadoDto MapearADto(UsuarioAsignado entidad) => new()
    {
        Id     = entidad.Id,
        Nombre = entidad.Nombre,
        Email  = entidad.Email
    };
}
