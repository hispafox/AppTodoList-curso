using AppTodoList.Dtos;
using AppTodoList.Services;
using Microsoft.AspNetCore.Mvc;

namespace AppTodoList.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlantillasController : ControllerBase
{
    private readonly IPlantillaService _servicio;

    public PlantillasController(IPlantillaService servicio)
    {
        _servicio = servicio;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlantillaDto>>> ObtenerTodas()
    {
        var plantillas = await _servicio.ObtenerTodasAsync();
        return Ok(plantillas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PlantillaDto>> ObtenerPorId(int id)
    {
        var plantilla = await _servicio.ObtenerPorIdAsync(id);
        if (plantilla is null)
            return NotFound();
        return Ok(plantilla);
    }

    [HttpPost]
    public async Task<ActionResult<PlantillaDto>> Crear(CrearPlantillaDto dto)
    {
        var creada = await _servicio.CrearAsync(dto);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.Id }, creada);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PlantillaDto>> Actualizar(int id, ActualizarPlantillaDto dto)
    {
        var actualizada = await _servicio.ActualizarAsync(id, dto);
        if (actualizada is null)
            return NotFound();
        return Ok(actualizada);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Eliminar(int id)
    {
        var eliminada = await _servicio.EliminarAsync(id);
        if (!eliminada)
            return NotFound();
        return NoContent();
    }

    [HttpPost("{id}/instanciar")]
    public async Task<ActionResult<TareaDto>> Instanciar(int id)
    {
        var tarea = await _servicio.InstanciarAsync(id);
        if (tarea is null)
            return NotFound();
        return CreatedAtAction(nameof(TareasController.ObtenerPorId), "Tareas", new { id = tarea.Id }, tarea);
    }
}
