using AppTodoList.Dtos;
using AppTodoList.Services;
using Microsoft.AspNetCore.Mvc;

namespace AppTodoList.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TareasController : ControllerBase
{
    private readonly ITodoService _servicio;

    public TareasController(ITodoService servicio)
    {
        _servicio = servicio;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TareaDto>>> ObtenerTodos([FromQuery] int? categoriaId)
    {
        var tareas = await _servicio.ObtenerTodosAsync(categoriaId);
        return Ok(tareas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TareaDto>> ObtenerPorId(int id)
    {
        var tarea = await _servicio.ObtenerPorIdAsync(id);
        if (tarea is null)
            return NotFound();
        return Ok(tarea);
    }

    [HttpPost]
    public async Task<ActionResult<TareaDto>> Crear(CrearTareaDto dto)
    {
        var creada = await _servicio.CrearAsync(dto);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.Id }, creada);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TareaDto>> Actualizar(int id, ActualizarTareaDto dto)
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

    [HttpPost("{id}/completar")]
    public async Task<ActionResult<TareaDto>> Completar(int id)
    {
        var resultado = await _servicio.CompletarAsync(id);
        if (resultado is null)
            return NotFound();
        return Ok(resultado);
    }
}
