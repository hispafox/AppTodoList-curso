using AppTodoList.Models;

namespace AppTodoList.Dtos;

// DTO de entrada para crear una plantilla
public class CrearPlantillaDto
{
    public string Titulo { get; set; } = string.Empty;
    public bool EsRepetitiva { get; set; } = false;
    public TipoRecurrencia? Recurrencia { get; set; }
}

// DTO de entrada para actualizar una plantilla
public class ActualizarPlantillaDto
{
    public string Titulo { get; set; } = string.Empty;
    public bool EsRepetitiva { get; set; } = false;
    public TipoRecurrencia? Recurrencia { get; set; }
}

// DTO de salida (respuesta)
public class PlantillaDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public bool EsRepetitiva { get; set; }
    public TipoRecurrencia? Recurrencia { get; set; }
}
