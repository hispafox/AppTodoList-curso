namespace AppTodoList.Models;

public class PlantillaTarea
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public bool EsRepetitiva { get; set; }
    public TipoRecurrencia? Recurrencia { get; set; }
}
