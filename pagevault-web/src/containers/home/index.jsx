import { useState } from 'react';
import './app.css';

// Dados de exemplo: os mesmos livros que estão no banco `vault`.
// Quando a API em C# estiver pronta, esta lista passa a vir dela.
const LIVROS_INICIAIS = [
  { id: 1, nome: 'Dracula', idioma: 'Português', genero: 'Romance Gótico', status: 'Lido', nota: 10 },
  { id: 2, nome: 'Neuromancer', idioma: 'Português', genero: 'Cyberpunk', status: 'Lido', nota: 9 },
  { id: 3, nome: 'Count Zero', idioma: 'Português', genero: 'Cyberpunk', status: 'Lido', nota: 7 },
  { id: 4, nome: 'Monalisa:Overdrive', idioma: 'Português', genero: 'Cyberpunk', status: 'Lendo', nota: null },
  { id: 5, nome: 'Meditações', idioma: 'Português', genero: 'Diário', status: 'Quero Ler', nota: null },
];

const FORM_VAZIO = {
  nome: '',
  idioma: '',
  genero: '',
  status: 'Quero Ler',
  nota: '',
};

export default function App() {
  const [livros, setLivros] = useState(LIVROS_INICIAIS);
  const [mensagem, setMensagem] = useState(null);
  const [formData, setFormData] = useState(FORM_VAZIO);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Adiciona o livro na lista local (ainda sem banco de dados)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Imita o AUTO_INCREMENT do banco: o próximo id é o maior atual + 1
    const proximoId = livros.length > 0 ? Math.max(...livros.map((l) => l.id)) + 1 : 1;

    const novoLivro = {
      id: proximoId,
      nome: formData.nome.trim(),
      idioma: formData.idioma.trim(),
      genero: formData.genero.trim() || null, // gênero é opcional, como no banco
      status: formData.status,
      nota: formData.nota !== '' ? parseFloat(formData.nota) : null,
    };

    setLivros((anteriores) => [...anteriores, novoLivro]);
    setFormData(FORM_VAZIO);
    setMensagem({ tipo: 'sucesso', texto: 'DADO ARQUIVADO COM SUCESSO NO TERMINAL.' });
    setTimeout(() => setMensagem(null), 3000);
  };

  return (
    <div className="terminal-wrapper">
      <div className="scanlines"></div>

      <header className="terminal-header">
        <h1>PAGEVAULT</h1>
        <p className="subtitle">
          SEU LIVRO SOBRE LIVROS
        </p>
      </header>

      {mensagem && (
        <div className={`status-banner ${mensagem.tipo}`}>
          &gt; {mensagem.texto}
        </div>
      )}

      <main className="terminal-grid">
        {/* Formulário de Inserção */}
        <section className="terminal-card">
          <div className="card-header">
            <span className="dot"></span>
            <h2>INSERIR NOVO LIVRO</h2>
          </div>

          <form onSubmit={handleSubmit} className="terminal-form">
            <div className="field-group">
              <label htmlFor="nome">Título da Obra [NOME]</label>
              <input
                id="nome"
                name="nome"
                type="text"
                maxLength={100}
                required
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Andróides Sonham com Ovelhas Elétricas?"
              />
            </div>

            <div className="field-group">
              <label htmlFor="idioma">Idioma [IDIOMA]</label>
              <input
                id="idioma"
                name="idioma"
                type="text"
                maxLength={100}
                required
                value={formData.idioma}
                onChange={handleChange}
                placeholder="Ex: Português"
              />
            </div>

            <div className="field-group">
              <label htmlFor="genero">Classificação [GÊNERO] (opcional)</label>
              <input
                id="genero"
                name="genero"
                type="text"
                maxLength={50}
                value={formData.genero}
                onChange={handleChange}
                placeholder="Ex: Cyberpunk, Distopia, Terror"
              />
            </div>

            <div className="field-row">
              <div className="field-group">
                <label htmlFor="status">Condição [STATUS]</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Quero Ler">Quero Ler</option>
                  <option value="Lendo">Lendo</option>
                  <option value="Lido">Lido</option>
                  <option value="Abandonado">Abandonado</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="nota">Avaliação [NOTA: 0.0 - 10.0]</label>
                <input
                  id="nota"
                  name="nota"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.nota}
                  onChange={handleChange}
                  placeholder="Ex: 9.2"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <span>GRAVAR DADOS NO LIVRO</span>
            </button>
          </form>
        </section>

        {/* Listagem de Registros */}
        <section className="terminal-card">
          <div className="card-header">
            <span className="dot pulse"></span>
            <h2>LIVROS ADICIONADOS ({livros.length})</h2>
          </div>

          <div className="book-log-list">
            {livros.length === 0 && (
              <div className="empty-text">&gt; NENHUM MANUSCRITO LOCALIZADO NA MATRIZ.</div>
            )}

            {livros.map((livro) => (
              <article key={livro.id} className="book-entry">
                <div className="book-meta">
                  <span className="id-tag">#ID {String(livro.id).padStart(4, '0')}</span>
                  <span className="status-tag">{livro.status}</span>
                </div>

                <h3 className="book-title">{livro.nome}</h3>

                <div className="book-details">
                  <span><strong>IDIOMA:</strong> {livro.idioma}</span>
                  <span><strong>GÊNERO:</strong> {livro.genero ?? '—'}</span>
                  <span className="nota-tag">
                    <strong>NOTA:</strong> {livro.nota !== null ? `${livro.nota} / 10` : 'S/A'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
