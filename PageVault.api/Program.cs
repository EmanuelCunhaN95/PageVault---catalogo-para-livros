using Microsoft.EntityFrameworkCore;
using PageVault.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuração do Banco de Dados
builder.Services.AddDbContext<PageVaultContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada.")));

// 2. Configuração dos Controllers (e aquele log de erros que fizemos)
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value != null && e.Value.Errors.Count > 0)
                .Select(e => new 
                { 
                    Campo = e.Key, 
                    Erro = e.Value?.Errors.Select(x => x.ErrorMessage) 
                });
            
            Console.WriteLine($"\n--- ERRO DE VALIDAÇÃO: {System.Text.Json.JsonSerializer.Serialize(errors)} ---\n");
            
            return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(context.ModelState);
        };
    });

// 3. Configuração do CORS (TEM QUE FICAR AQUI, ANTES DO BUILD)
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Confirme a porta do seu React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

// AQUI O APP É CONSTRUÍDO (A partir daqui não podemos mais usar builder.Services)
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection(); // Deixe comentado para evitar redirecionamentos chatos

// 4. Ativação do CORS (TEM QUE FICAR AQUI, DEPOIS DO BUILD)
app.UseCors("PermitirReact");

app.UseAuthorization();

app.MapControllers();

app.Run();