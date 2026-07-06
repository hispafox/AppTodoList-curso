using AppTodoList.Dtos;
using AppTodoList.LogicaNegocio;
using AppTodoList.Models;

namespace AppTodoList.Services;

public class PlantillaService : IPlantillaService
{
    private readonly IPlantillaLogica _logica;

    public PlantillaService(IPlantillaLogica logica)
    {
        _logica = logica;
    }

    public async Task<IEnumerable<PlantillaDto>> ObtenerTodasAsync()
    {
        var entidades = await _logica.ObtenerTodasAsync();
        return entidades.Select(MapearADto);
    }

    public async Task<PlantillaDto?> ObtenerPorIdAsync(int id)
    {
        var entidad = await _logica.ObtenerPorIdAsync(id);
        return entidad is null ? null : MapearADto(entidad);
    }

    public async Task<PlantillaDto> CrearAsync(CrearPlantillaDto dto)
    {
        var entidad = new PlantillaTarea
        {
            Titulo = dto.Titulo,
            EsRepetitiva = dto.EsRepetitiva,
            Recurrencia = dto.Recurrencia
        };
        var creada = await _logica.CrearAsync(entidad);
        return MapearADto(creada);
    }

    public async Task<PlantillaDto?> ActualizarAsync(int id, ActualizarPlantillaDto dto)
    {
        var entidad = new PlantillaTarea
        {
            Titulo = dto.Titulo,
            EsRepetitiva = dto.EsRepetitiva,
            Recurrencia = dto.Recurrencia
        };
        var actualizada = await _logica.ActualizarAsync(id, entidad);
        return actualizada is null ? null : MapearADto(actualizada);
    }

    public async Task<bool> EliminarAsync(int id)
        => await _logica.EliminarAsync(id);

    public async Task<TareaDto?> InstanciarAsync(int id)
    {
        var tarea = await _logica.InstanciarAsync(id);
        return tarea is null ? null : MapearTareaADto(tarea);
    }

    private static PlantillaDto MapearADto(PlantillaTarea entidad) => new()
    {
        Id = entidad.Id,
        Titulo = entidad.Titulo,
        EsRepetitiva = entidad.EsRepetitiva,
        Recurrencia = entidad.Recurrencia
    };

    private static TareaDto MapearTareaADto(TodoItem entidad) => new()
    {
        Id = entidad.Id,
        Title = entidad.Title,
        IsCompleted = entidad.IsCompleted,
        CreatedAt = entidad.CreatedAt,
        EsRepetitiva = entidad.EsRepetitiva,
        Recurrencia = entidad.Recurrencia,
        ProximaFecha = entidad.ProximaFecha,
        PlantillaId = entidad.PlantillaId
    };
}
