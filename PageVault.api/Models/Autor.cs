using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PageVault.Api.Models;

[Table("autores")]
public class Autor
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    // Propriedade de navegação: Um autor pode ter vários livros
    public ICollection<Livro> Livros { get; set; } = new List<Livro>();
}