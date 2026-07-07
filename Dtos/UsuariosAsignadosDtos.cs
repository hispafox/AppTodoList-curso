using System.ComponentModel.DataAnnotations;

namespace AppTodoList.Dtos;

// DTO de entrada para crear un usuario asignado
public class CrearUsuarioAsignadoDto
{
    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

// DTO de entrada para actualizar un usuario asignado
public class ActualizarUsuarioAsignadoDto
{
    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

// DTO de salida (respuesta)
public class UsuarioAsignadoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
