using AppTodoList.Dtos;
using AppTodoList.Services;
using Microsoft.AspNetCore.Mvc;

namespace AppTodoList.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosAsignadosController : ControllerBase
{
    private readonly IUsuarioAsignadoService _servicio;

    public UsuariosAsignadosController(IUsuarioAsignadoService servicio)
    {
        _servicio = servicio;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsuarioAsignadoDto>>> ObtenerTodos()
    {
        var usuarios = await _servicio.ObtenerTodosAsync();
        return Ok(usuarios);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UsuarioAsignadoDto>> ObtenerPorId(int id)
    {
        var usuario = await _servicio.ObtenerPorIdAsync(id);
        if (usuario is null)
            return NotFound();
        return Ok(usuario);
    }

    [HttpPost]
    public async Task<ActionResult<UsuarioAsignadoDto>> Crear(CrearUsuarioAsignadoDto dto)
    {
        var creado = await _servicio.CrearAsync(dto);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UsuarioAsignadoDto>> Actualizar(int id, ActualizarUsuarioAsignadoDto dto)
    {
        var actualizado = await _servicio.ActualizarAsync(id, dto);
        if (actualizado is null)
            return NotFound();
        return Ok(actualizado);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Eliminar(int id)
    {
        var eliminado = await _servicio.EliminarAsync(id);
        if (!eliminado)
            return NotFound();
        return NoContent();
    }
}
