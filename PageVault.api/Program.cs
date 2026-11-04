using Microsoft.EntityFrameworkCore;
using PageVault.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PageVaultContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada.")));

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection(); // Deixe comentado como você já fez

app.UseAuthorization();
app.MapControllers();
app.Run();