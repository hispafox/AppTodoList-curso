using AppTodoList.Models;
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
    public async Task<ActionResult<IEnumerable<TodoItem>>> ObtenerTodos()
    {
        var tareas = await _servicio.ObtenerTodosAsync();
        return Ok(tareas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> ObtenerPorId(int id)
    {
        var tarea = await _servicio.ObtenerPorIdAsync(id);
        if (tarea is null)
            return NotFound();
        return Ok(tarea);
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> Crear(TodoItem tarea)
    {
        var creada = await _servicio.CrearAsync(tarea);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.Id }, creada);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TodoItem>> Actualizar(int id, TodoItem tarea)
    {
        if (id != tarea.Id)
            return BadRequest();
        var actualizada = await _servicio.ActualizarAsync(tarea);
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
    public async Task<ActionResult<TodoItem>> Completar(int id)
    {
        var resultado = await _servicio.CompletarAsync(id);
        if (resultado is null)
            return NotFound();
        return Ok(resultado);
    }
}
