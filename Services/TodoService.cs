using AppTodoList.Dtos;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;

namespace AppTodoList.Services;

public class TodoService : ITodoService
{
    private readonly ITodoLogica _logica;

    public TodoService(ITodoLogica logica)
    {
        _logica = logica;
    }

    public async Task<IEnumerable<TareaDto>> ObtenerTodosAsync(int? categoriaId = null)
    {
        var entidades = await _logica.ObtenerTodosAsync(categoriaId);
        return entidades.Select(MapearADto);
    }

    public async Task<TareaDto?> ObtenerPorIdAsync(int id)
    {
        var entidad = await _logica.ObtenerPorIdAsync(id);
        return entidad is null ? null : MapearADto(entidad);
    }

    public async Task<TareaDto> CrearAsync(CrearTareaDto dto)
    {
        var entidad = new TodoItem
        {
            Title             = dto.Title,
            EsRepetitiva      = dto.EsRepetitiva,
            Recurrencia       = dto.Recurrencia,
            PlantillaId       = dto.PlantillaId,
            UsuarioAsignadoId = dto.UsuarioAsignadoId,
            CategoriaId       = dto.CategoriaId
        };
        var creada = await _logica.CrearAsync(entidad);
        return MapearADto(creada);
    }

    public async Task<TareaDto?> ActualizarAsync(int id, ActualizarTareaDto dto)
    {
        var entidad = new TodoItem
        {
            Title             = dto.Title,
            IsCompleted       = dto.IsCompleted,
            EsRepetitiva      = dto.EsRepetitiva,
            Recurrencia       = dto.Recurrencia,
            UsuarioAsignadoId = dto.UsuarioAsignadoId,
            CategoriaId       = dto.CategoriaId
        };
        var actualizada = await _logica.ActualizarAsync(id, entidad);
        return actualizada is null ? null : MapearADto(actualizada);
    }

    public async Task<bool> EliminarAsync(int id)
        => await _logica.EliminarAsync(id);

    public async Task<TareaDto?> CompletarAsync(int id)
    {
        var resultado = await _logica.CompletarAsync(id);
        return resultado is null ? null : MapearADto(resultado);
    }

    private static TareaDto MapearADto(TodoItem entidad) => new()
    {
        Id                    = entidad.Id,
        Title                 = entidad.Title,
        IsCompleted           = entidad.IsCompleted,
        CreatedAt             = entidad.CreatedAt,
        EsRepetitiva          = entidad.EsRepetitiva,
        Recurrencia           = entidad.Recurrencia,
        ProximaFecha          = entidad.ProximaFecha,
        PlantillaId           = entidad.PlantillaId,
        UsuarioAsignadoId     = entidad.UsuarioAsignadoId,
        UsuarioAsignadoNombre = entidad.UsuarioAsignado?.Nombre,
        CategoriaId           = entidad.CategoriaId,
        CategoriaNombre       = entidad.Categoria?.Nombre
    };
}
