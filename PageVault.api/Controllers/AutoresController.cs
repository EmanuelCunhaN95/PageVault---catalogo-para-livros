using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PageVault.Api.Data;
using PageVault.Api.Models;

namespace PageVault.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AutoresController : ControllerBase
{
    private readonly PageVaultContext _context;

    public AutoresController(PageVaultContext context)
    {
        _context = context;
    }

    // GET: api/autores (Listar todos os autores)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Autor>>> GetAutores()
    {
        return await _context.Autores.ToListAsync();
    }

    // POST: api/autores (Cadastrar um novo autor - útil para depois)
    [HttpPost]
    public async Task<ActionResult<Autor>> PostAutor(Autor autor)
    {
        _context.Autores.Add(autor);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAutores), new { id = autor.Id }, autor);
    }
}