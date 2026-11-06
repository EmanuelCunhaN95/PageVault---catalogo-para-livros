import { useState, useEffect } from 'react';
import './app.css';

const FORM_VAZIO = {
  nome: '',
  idioma: '',
  genero: '',
  status: 'Quero Ler',
  nota: '',
  autorId: '',
};

const API_URL = 'http://localhost:5052/api/livros';
const AUTORES_URL = 'http://localhost:5052/api/autores';

export default function App() {
  const [livros, setLivros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [formData, setFormData] = useState(FORM_VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  
  // NOVOS ESTADOS PARA O CADASTRO RÁPIDO DE AUTOR
  const [novoAutorNome, setNovoAutorNome] = useState('');
  const [adicionandoAutor, setAdicionandoAutor] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resLivros, resAutores] = await Promise.all([
          fetch(API_URL),
          fetch(AUTORES_URL)
        ]);

        if (!resLivros.ok || !resAutores.ok) throw new Error('Erro na API');

        const dataLivros = await resLivros.json();
        const dataAutores = await resAutores.json();

        setLivros(dataLivros);
        setAutores(dataAutores);
        
        if (dataAutores.length > 0) {
          setFormData(prev => ({ ...prev, autorId: dataAutores[0].id }));
        }
      } catch (error) {
        console.error(error);
        setMensagem({ tipo: 'erro', texto: 'FALHA NA CONEXÃO COM A MATRIZ (API).' });
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Se mudou o select de autor
    if (name === 'autorId') {
      if (value === 'novo') {
        setAdicionandoAutor(true);
        setFormData(prev => ({ ...prev, autorId: 'novo' }));
      } else {
        setAdicionandoAutor(false);
        setFormData(prev => ({ ...prev, autorId: parseInt(value) }));
      }
      return;
    }

    // Para os outros campos
    const valorFinal = name === 'autorId' ? parseInt(value) : value;
    setFormData((prev) => ({ ...prev, [name]: valorFinal }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let idAutorParaSalvar = formData.autorId;

      // SE O USUÁRIO ESCOLHEU CRIAR UM NOVO AUTOR
      if (adicionandoAutor) {
        if (!novoAutorNome.trim()) {
          setMensagem({ tipo: 'erro', texto: 'DIGITE O NOME DO NOVO AUTOR.' });
          setTimeout(() => setMensagem(null), 3000);
          return;
        }

        // 1. Cria o autor na API
        const resAutor = await fetch(AUTORES_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: novoAutorNome.trim() }),
        });

        if (!resAutor.ok) throw new Error('Erro ao criar autor');
        
        const autorSalvo = await resAutor.json();
        idAutorParaSalvar = autorSalvo.id;

        // Atualiza a lista local de autores para o dropdown
        setAutores(prev => [...prev, autorSalvo]);
      }

      // 2. Prepara o livro com o ID do autor (novo ou existente)
      const livroParaAPI = {
        nome: formData.nome.trim(),
        idioma: formData.idioma.trim(),
        genero: formData.genero.trim() || null,
        status: formData.status,
        nota: formData.nota !== '' ? parseFloat(formData.nota) : null,
        autorId: parseInt(idAutorParaSalvar)
      };

      let response;

      if (editandoId) {
        livroParaAPI.id = editandoId;
        response = await fetch(`${API_URL}/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(livroParaAPI),
        });
        
        if (!response.ok) throw new Error('Erro ao editar livro');
        
        const resLista = await fetch(API_URL);
        const listaAtualizada = await resLista.json();
        setLivros(listaAtualizada);
        setMensagem({ tipo: 'sucesso', texto: 'DADOS ATUALIZADOS COM SUCESSO.' });

      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(livroParaAPI),
        });

        if (!response.ok) throw new Error('Erro ao salvar livro');
        
        // Como criamos um autor novo, precisamos pegar o objeto do estado atualizado
        const resLista = await fetch(API_URL);
        const listaAtualizada = await resLista.json();
        setLivros(listaAtualizada);
        
        setMensagem({ tipo: 'sucesso', texto: 'DADO ARQUIVADO COM SUCESSO.' });
      }

      // Limpeza
      setFormData({ ...FORM_VAZIO, autorId: autores[0]?.id || '' });
      setNovoAutorNome('');
      setAdicionandoAutor(false);
      setEditandoId(null);
      setTimeout(() => setMensagem(null), 3000);

    } catch (error) {
      console.error(error);
      setMensagem({ tipo: 'erro', texto: 'FALHA AO GRAVAR NO BANCO DE DADOS.' });
      setTimeout(() => setMensagem(null), 3000);
    }
  };

  const handleEditar = (livro) => {
    setFormData({
      nome: livro.nome,
      idioma: livro.idioma,
      genero: livro.genero || '',
      status: livro.status,
      nota: livro.nota !== null ? livro.nota.toString() : '',
      autorId: livro.autorId || '',
    });
    setEditandoId(livro.id);
    setAdicionandoAutor(false);
    setNovoAutorNome('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este manuscrito?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir');
      setLivros(livros.filter(l => l.id !== id));
      setMensagem({ tipo: 'sucesso', texto: 'MANUSCRITO DELETADO.' });
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      console.error(error);
      setMensagem({ tipo: 'erro', texto: 'FALHA AO DELETAR.' });
      setTimeout(() => setMensagem(null), 3000);
    }
  };

  return (
    <div className="terminal-wrapper">
      <div className="scanlines"></div>

      <header className="terminal-header">
        <h1>PAGEVAULT</h1>
        <p className="subtitle">SEU LIVRO SOBRE LIVROS</p>
      </header>

      {mensagem && (
        <div className={`status-banner ${mensagem.tipo}`}>
          &gt; {mensagem.texto}
        </div>
      )}

      <main className="terminal-grid">
        <section className="terminal-card">
          <div className="card-header">
            <span className="dot"></span>
            <h2>{editandoId ? 'EDITAR LIVRO' : 'INSERIR NOVO LIVRO'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="terminal-form">
            <div className="field-group">
              <label htmlFor="nome">Título da Obra [NOME]</label>
              <input id="nome" name="nome" type="text" required value={formData.nome} onChange={handleChange} placeholder="Ex: Andróides Sonham..." />
            </div>

            <div className="field-group">
              <label htmlFor="idioma">Idioma [IDIOMA]</label>
              <input id="idioma" name="idioma" type="text" required value={formData.idioma} onChange={handleChange} placeholder="Ex: Português" />
            </div>

            {/* CAMPO DE AUTOR COM A OPÇÃO DE CRIAR NOVO */}
            <div className="field-group">
              <label htmlFor="autorId">Autor da Obra [AUTOR]</label>
              <select id="autorId" name="autorId" required value={formData.autorId} onChange={handleChange}>
                {autores.map(autor => (
                  <option key={autor.id} value={autor.id}>{autor.nome}</option>
                ))}
                <option value="novo" style={{ color: '#00ff00', fontWeight: 'bold' }}>+ Adicionar novo autor...</option>
              </select>
            </div>

            {/* CAMPO QUE APARECE SE ESCOLHER "NOVO" */}
            {adicionandoAutor && (
              <div className="field-group" style={{ borderLeft: '3px solid #00ff00', paddingLeft: '10px' }}>
                <label htmlFor="novoAutorNome">Nome do Novo Autor</label>
                <input 
                  id="novoAutorNome" 
                  type="text" 
                  required 
                  value={novoAutorNome} 
                  onChange={(e) => setNovoAutorNome(e.target.value)} 
                  placeholder="Ex: Frank Herbert" 
                  style={{ borderColor: '#00ff00', backgroundColor: '#111', color: '#fff' }}
                />
              </div>
            )}

            <div className="field-group">
              <label htmlFor="genero">Classificação [GÊNERO] (opcional)</label>
              <input id="genero" name="genero" type="text" value={formData.genero} onChange={handleChange} placeholder="Ex: Cyberpunk" />
            </div>

            <div className="field-row">
              <div className="field-group">
                <label htmlFor="status">Condição [STATUS]</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Quero Ler">Quero Ler</option>
                  <option value="Lendo">Lendo</option>
                  <option value="Lido">Lido</option>
                  <option value="Abandonado">Abandonado</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="nota">Avaliação [NOTA: 0.0 - 10.0]</label>
                <input id="nota" name="nota" type="number" step="0.1" min="0" max="10" value={formData.nota} onChange={handleChange} placeholder="Ex: 9.2" />
              </div>
            </div>

            <button type="submit" className="submit-btn" style={{ backgroundColor: editandoId ? '#007bff' : '#00ff00' }}>
              <span>{editandoId ? 'SALVAR ALTERAÇÕES' : 'GRAVAR DADOS NO LIVRO'}</span>
            </button>
            
            {editandoId && (
              <button type="button" className="submit-btn" style={{ backgroundColor: '#555', marginTop: '10px' }} onClick={() => { setEditandoId(null); setFormData({ ...FORM_VAZIO, autorId: autores[0]?.id || '' }); setAdicionandoAutor(false); setNovoAutorNome(''); }}>
                <span>CANCELAR EDIÇÃO</span>
              </button>
            )}
          </form>

          {livros.length > 0 && (
            <div style={{ marginTop: '20px', borderTop: '1px dashed #00ff00', paddingTop: '15px' }}>
              <p style={{ fontSize: '0.8rem', color: '#00ff00', marginBottom: '10px' }}>&gt; AÇÕES NO MANUSCRITO SELECIONADO:</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="submit-btn" style={{ flex: 1, backgroundColor: '#ffc107', color: '#000' }} disabled={!editandoId} onClick={() => { const livro = livros.find(l => l.id === editandoId); if(livro) handleEditar(livro); }}>
                  EDITAR
                </button>
                <button className="submit-btn" style={{ flex: 1, backgroundColor: '#dc3545' }} disabled={!editandoId} onClick={() => handleExcluir(editandoId)}>
                  EXCLUIR
                </button>
              </div>
              {!editandoId && <p style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '5px' }}>*Selecione um livro na lista para habilitar.</p>}
            </div>
          )}
        </section>

        <section className="terminal-card">
          <div className="card-header">
            <span className="dot pulse"></span>
            <h2>LIVROS ADICIONADOS ({livros.length})</h2>
          </div>

          <div className="book-log-list">
            {carregando && <div className="empty-text">&gt; SINCRONIZANDO...</div>}
            {!carregando && livros.length === 0 && <div className="empty-text">&gt; NENHUM MANUSCRITO LOCALIZADO.</div>}

            {livros.map((livro) => (
              <article key={livro.id} className="book-entry" onClick={() => setEditandoId(livro.id)} style={{ cursor: 'pointer', border: editandoId === livro.id ? '2px solid #ffc107' : '1px solid #333' }}>
                <div className="book-meta">
                  <span className="id-tag">#ID {String(livro.id).padStart(4, '0')}</span>
                  <span className="status-tag">{livro.status}</span>
                </div>
                <h3 className="book-title">{livro.nome}</h3>
                <div className="book-details">
                  <span><strong>AUTOR:</strong> {livro.autor?.nome ?? '—'}</span>
                  <span><strong>IDIOMA:</strong> {livro.idioma}</span>
                  <span><strong>GÊNERO:</strong> {livro.genero ?? '—'}</span>
                  <span className="nota-tag"><strong>NOTA:</strong> {livro.nota !== null ? `${livro.nota} / 10` : 'S/A'}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}