using AppTodoList.Dtos;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;

namespace AppTodoList.Services;

public class CategoriaService : ICategoriaService
{
    private readonly ICategoriaLogica _logica;

    public CategoriaService(ICategoriaLogica logica)
    {
        _logica = logica;
    }

    public async Task<IEnumerable<CategoriaDto>> ObtenerTodosAsync()
    {
        var entidades = await _logica.ObtenerTodosAsync();
        return entidades.Select(MapearADto);
    }

    public async Task<CategoriaDto?> ObtenerPorIdAsync(int id)
    {
        var entidad = await _logica.ObtenerPorIdAsync(id);
        return entidad is null ? null : MapearADto(entidad);
    }

    public async Task<CategoriaDto> CrearAsync(CrearCategoriaDto dto)
    {
        var entidad = new Categoria
        {
            Nombre = dto.Nombre,
            Color = dto.Color
        };
        var creada = await _logica.CrearAsync(entidad);
        return MapearADto(creada);
    }

    public async Task<CategoriaDto?> ActualizarAsync(int id, ActualizarCategoriaDto dto)
    {
        var entidad = new Categoria
        {
            Nombre = dto.Nombre,
            Color = dto.Color
        };
        var actualizada = await _logica.ActualizarAsync(id, entidad);
        return actualizada is null ? null : MapearADto(actualizada);
    }

    public async Task<bool> EliminarAsync(int id)
        => await _logica.EliminarAsync(id);

    private static CategoriaDto MapearADto(Categoria entidad) => new()
    {
        Id = entidad.Id,
        Nombre = entidad.Nombre,
        Color = entidad.Color
    };
}
