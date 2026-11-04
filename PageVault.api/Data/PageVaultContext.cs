using Microsoft.EntityFrameworkCore;
using PageVault.Api.Models;

namespace PageVault.Api.Data;

public class PageVaultContext : DbContext
{
    public PageVaultContext(DbContextOptions<PageVaultContext> options) : base(options)
    {
    }

    public DbSet<Livro> Livros { get; set; }
    public DbSet<Autor> Autores { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Garante que o nome do autor seja único
        modelBuilder.Entity<Autor>()
            .HasIndex(a => a.Nome)
            .IsUnique();
    }
}