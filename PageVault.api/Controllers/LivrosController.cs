using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PageVault.Api.Data;
using PageVault.Api.Models;

namespace PageVault.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LivrosController : ControllerBase
{
    private readonly PageVaultContext _context;

    public LivrosController(PageVaultContext context)
    {
        _context = context;
    }

    // 1. GET: api/livros (Já funciona)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Livro>>> GetLivros()
    {
        // O Include(l => l.Autor) faz um JOIN com a tabela de autores
        return await _context.Livros.Include(l => l.Autor).ToListAsync();
    }

    // 2. GET: api/livros/5 (Buscar um livro específico pelo ID)
    [HttpGet("{id}")]
    public async Task<ActionResult<Livro>> GetLivro(int id)
    {
        var livro = await _context.Livros.FindAsync(id);

        if (livro == null)
        {
            return NotFound(); // Retorna 404 se não achar
        }

        return livro;
    }

    // 3. POST: api/livros (Cadastrar um novo livro)
    [HttpPost]
    public async Task<ActionResult<Livro>> PostLivro(Livro livro)
    {
        _context.Livros.Add(livro);
        await _context.SaveChangesAsync(); // Salva no banco de verdade

        // Retorna 201 (Created) e o caminho para acessar o novo livro
        return CreatedAtAction(nameof(GetLivro), new { id = livro.Id }, livro);
    }

    // 4. PUT: api/livros/5 (Atualizar um livro existente)
    [HttpPut("{id}")]
    public async Task<IActionResult> PutLivro(int id, Livro livro)
    {
        if (id != livro.Id)
        {
            return BadRequest(); // O ID da URL é diferente do ID do corpo
        }

        _context.Entry(livro).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!LivroExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent(); // Retorna 204 (Sucesso, sem conteúdo)
    }

    // 5. DELETE: api/livros/5 (Excluir um livro)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLivro(int id)
    {
        var livro = await _context.Livros.FindAsync(id);
        if (livro == null)
        {
            return NotFound();
        }

        _context.Livros.Remove(livro);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Método auxiliar para verificar se o livro existe
    private bool LivroExists(int id)
    {
        return _context.Livros.Any(e => e.Id == id);
    }
}