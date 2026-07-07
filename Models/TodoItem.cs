namespace AppTodoList.Models;

public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool EsRepetitiva { get; set; }
    public TipoRecurrencia? Recurrencia { get; set; }
    public DateTime? ProximaFecha { get; set; }
    public int? PlantillaId { get; set; }
    public PlantillaTarea? Plantilla { get; set; }
    public int? UsuarioAsignadoId { get; set; }
    public UsuarioAsignado? UsuarioAsignado { get; set; }
    public int? CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }
}
