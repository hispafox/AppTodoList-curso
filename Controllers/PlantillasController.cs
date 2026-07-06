using AppTodoList.Models;
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
    public async Task<ActionResult<IEnumerable<PlantillaTarea>>> ObtenerTodas()
    {
        var plantillas = await _servicio.ObtenerTodasAsync();
        return Ok(plantillas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PlantillaTarea>> ObtenerPorId(int id)
    {
        var plantilla = await _servicio.ObtenerPorIdAsync(id);
        if (plantilla is null)
            return NotFound();
        return Ok(plantilla);
    }

    [HttpPost]
    public async Task<ActionResult<PlantillaTarea>> Crear(PlantillaTarea plantilla)
    {
        var creada = await _servicio.CrearAsync(plantilla);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.Id }, creada);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PlantillaTarea>> Actualizar(int id, PlantillaTarea plantilla)
    {
        if (id != plantilla.Id)
            return BadRequest();
        var actualizada = await _servicio.ActualizarAsync(plantilla);
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
    public async Task<ActionResult<TodoItem>> Instanciar(int id)
    {
        var tarea = await _servicio.InstanciarAsync(id);
        if (tarea is null)
            return NotFound();
        return CreatedAtAction("ObtenerPorId", "Tareas", new { id = tarea.Id }, tarea);
    }
}
