using AppTodoList.Models;
using Microsoft.EntityFrameworkCore;

namespace AppTodoList.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();
    public DbSet<PlantillaTarea> PlantillasTarea => Set<PlantillaTarea>();
    public DbSet<UsuarioAsignado> UsuariosAsignados => Set<UsuarioAsignado>();
    public DbSet<Categoria> Categorias => Set<Categoria>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            entity.Property(e => e.IsCompleted).HasDefaultValue(false);
            entity.Property(e => e.EsRepetitiva).HasDefaultValue(false);

            entity.HasOne(e => e.Plantilla)
                  .WithMany()
                  .HasForeignKey(e => e.PlantillaId)
                  .OnDelete(DeleteBehavior.SetNull)
                  .IsRequired(false);

            entity.HasOne(e => e.UsuarioAsignado)
                  .WithMany()
                  .HasForeignKey(e => e.UsuarioAsignadoId)
                  .OnDelete(DeleteBehavior.SetNull)
                  .IsRequired(false);

            entity.HasOne(e => e.Categoria)
                  .WithMany(c => c.Tareas)
                  .HasForeignKey(e => e.CategoriaId)
                  .OnDelete(DeleteBehavior.SetNull)
                  .IsRequired(false);
        });

        modelBuilder.Entity<PlantillaTarea>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.EsRepetitiva).HasDefaultValue(false);
        });

        modelBuilder.Entity<UsuarioAsignado>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Color).IsRequired().HasMaxLength(7);
        });
    }
}
