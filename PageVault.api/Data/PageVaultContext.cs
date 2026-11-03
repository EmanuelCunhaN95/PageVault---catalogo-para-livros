using Microsoft.EntityFrameworkCore;
using PageVault.Api.Models;

namespace PageVault.Api.Data;

// A classe herda de DbContext, que é a classe base do Entity Framework
public class PageVaultContext : DbContext
{
    // O construtor recebe as opções de configuração (como a string de conexão)
    public PageVaultContext(DbContextOptions<PageVaultContext> options) : base(options)
    {
    }

    // Estas propriedades representam as tabelas no banco de dados.
    // O EF vai mapear "Livros" para a tabela "livros" e "Autores" para "autores"
    public DbSet<Livro> Livros { get; set; }
    public DbSet<Autor> Autores { get; set; }

    // Opcional: Método para configurar detalhes finos do mapeamento
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Exemplo: Podemos garantir que o nome do autor seja único (como no seu schema.sql)
        modelBuilder.Entity<Autor>()
            .HasIndex(a => a.Nome)
            .IsUnique();
    }
}