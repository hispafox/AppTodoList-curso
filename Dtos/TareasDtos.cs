using System.ComponentModel.DataAnnotations;
using AppTodoList.Models;

namespace AppTodoList.Dtos;

// DTO de entrada para crear una tarea
public class CrearTareaDto
{
    [Required(ErrorMessage = "El título es obligatorio")]
    [MaxLength(200, ErrorMessage = "El título no puede superar 200 caracteres")]
    public string Title { get; set; } = string.Empty;
    public bool EsRepetitiva { get; set; } = false;
    public TipoRecurrencia? Recurrencia { get; set; }
    public int? PlantillaId { get; set; }
}

// DTO de entrada para actualizar una tarea
public class ActualizarTareaDto
{
    [Required(ErrorMessage = "El título es obligatorio")]
    [MaxLength(200, ErrorMessage = "El título no puede superar 200 caracteres")]
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; } = false;
    public bool EsRepetitiva { get; set; } = false;
    public TipoRecurrencia? Recurrencia { get; set; }
}

// DTO de salida (respuesta)
public class TareaDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool EsRepetitiva { get; set; }
    public TipoRecurrencia? Recurrencia { get; set; }
    public DateTime? ProximaFecha { get; set; }
    public int? PlantillaId { get; set; }
}
