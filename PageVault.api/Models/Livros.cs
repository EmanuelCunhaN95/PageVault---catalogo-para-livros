using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PageVault.Api.Models;

[Table("livros")] // Diz ao EF que essa classe se chama "livros" no banco
public class Livro
{
    [Key] // Diz que o Id é a chave primária
    public int Id { get; set; }

    [Required] // Torna o campo obrigatório
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Idioma { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string? Genero { get; set; } // O "?" indica que pode ser nulo (opcional)

    [Required]
    public string Status { get; set; } = "Quero Ler";

    // O tipo decimal no C# tem precisão. (3,1) significa 3 dígitos no total, 1 após a vírgula (ex: 10.0)
    [Column(TypeName = "decimal(3,1)")]
    public decimal? Nota { get; set; }

    // Chave Estrangeira (Foreign Key)
    public int? AutorId { get; set; }

    // Propriedade de navegação: Permite acessar os dados do Autor a partir do Livro
    [ForeignKey("AutorId")]
    public Autor? Autor { get; set; }
}