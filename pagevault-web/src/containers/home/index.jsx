import { useState, useEffect } from 'react'; // Adicionamos o useEffect aqui
import './app.css';

// A constante LIVROS_INICIAIS foi apagada, pois agora os dados vêm da API.

const FORM_VAZIO = {
  nome: '',
  idioma: '',
  genero: '',
  status: 'Quero Ler',
  nota: '',
};

// URL da sua API (confirme se a porta é 5052 mesmo)
const API_URL = 'http://localhost:5052/api/livros';

export default function App() {
  const [livros, setLivros] = useState([]); // Começa vazio, vai preencher com o banco
  const [mensagem, setMensagem] = useState(null);
  const [formData, setFormData] = useState(FORM_VAZIO);
  const [carregando, setCarregando] = useState(true); // Para mostrar "Carregando..."

  // 1. BUSCAR OS LIVROS DO BANCO AO CARREGAR A PÁGINA
  useEffect(() => {
    const buscarLivros = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar livros');
        
        const data = await response.json();
        setLivros(data);
      } catch (error) {
        console.error(error);
        setMensagem({ tipo: 'erro', texto: 'FALHA NA CONEXÃO COM A MATRIZ (API).' });
      } finally {
        setCarregando(false);
      }
    };

    buscarLivros();
  }, []); // O array vazio [] significa "rode apenas uma vez ao montar a tela"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. ENVIAR O NOVO LIVRO PARA O BANCO
  const handleSubmit = async (e) => {
    e.preventDefault();

    const novoLivroParaAPI = {
      nome: formData.nome.trim(),
      idioma: formData.idioma.trim(),
      genero: formData.genero.trim() || null,
      status: formData.status,
      nota: formData.nota !== '' ? parseFloat(formData.nota) : null,
      autorId: 1 // Temporário: estamos fixando o Autor 1 (Bram Stoker) para funcionar
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoLivroParaAPI),
      });

      if (!response.ok) throw new Error('Erro ao salvar livro');

      // A API devolve o livro salvo com o ID novo gerado pelo banco
      const livroSalvo = await response.json();

      // Atualiza a lista na tela sem precisar recarregar a página
      setLivros((anteriores) => [...anteriores, livroSalvo]);
      
      setFormData(FORM_VAZIO);
      setMensagem({ tipo: 'sucesso', texto: 'DADO ARQUIVADO COM SUCESSO NO BANCO DE DADOS.' });
      setTimeout(() => setMensagem(null), 3000);

    } catch (error) {
      console.error(error);
      setMensagem({ tipo: 'erro', texto: 'FALHA AO GRAVAR NO BANCO DE DADOS.' });
      setTimeout(() => setMensagem(null), 3000);
    }
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
            {carregando && (
              <div className="empty-text">&gt; SINCRONIZANDO COM A MATRIZ...</div>
            )}

            {!carregando && livros.length === 0 && (
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