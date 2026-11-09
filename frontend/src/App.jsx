
import { useState } from 'react'
import './App.css'

function App() {
  const [busca, setBusca] = useState('')
  const [empresaSelecionada, setEmpresaSelecionada] = useState('Todas')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [projetoEditando, setProjetoEditando] = useState(null);
  const [novoProjeto, setNovoProjeto] = useState({
    nome: '',
    empresa: '',
    descricao: '',
    membros: ''
  })

  // Projetos de exemplo para testar a interface
  const projetos = [
    {
      id: 1,
      nome: 'Projeto de Análise de Dados',
      empresa: 'WEG',
      descricao: 'Análise de dados e desenvolvimento de soluções.',
      membros: ['Maria', 'João', 'Ana']
    },
    {
      id: 2,
      nome: 'Desenvolvimento de Plataforma',
      empresa: 'CERTI',
      descricao: 'Desenvolvimento de uma plataforma para gestão de informações.',
      membros: ['Pedro', 'Maria']
    },
    {
      id: 3,
      nome: 'Projeto de Inovação',
      empresa: 'Embraco',
      descricao: 'Pesquisa e desenvolvimento de soluções inovadoras.',
      membros: ['Ana', 'Lucas']
    },
    {
      id: 4,
      nome: 'Projeto de Tecnologia',
      empresa: 'Landis+Gyr',
      descricao: 'Desenvolvimento de soluções tecnológicas.',
      membros: ['João', 'Pedro', 'Maria']
    }
  ]

  // Lista de projetos que poderá ser atualizada
  const [listaProjetos, setListaProjetos] = useState(projetos)

  // Filtrar projetos pela pesquisa e pela empresa
  const projetosFiltrados = listaProjetos.filter((projeto) => {
    const textoBusca = busca.toLowerCase()

    const correspondeBusca =
      projeto.nome.toLowerCase().includes(textoBusca) ||
      projeto.empresa.toLowerCase().includes(textoBusca) ||
      projeto.membros.some((membro) => membro.toLowerCase().includes(textoBusca))

    const correspondeEmpresa =
      empresaSelecionada === 'Todas' || projeto.empresa === empresaSelecionada

    return correspondeBusca && correspondeEmpresa
  })

  // Cadastrar um novo projeto
  function cadastrarProjeto(e) {
  e.preventDefault();

  const projetoAtualizado = {
    nome: novoProjeto.nome,
    empresa: novoProjeto.empresa,
    descricao: novoProjeto.descricao,
    membros: novoProjeto.membros.split(",").map((membro) => membro.trim()).filter((membro) => membro !== "")
  };

  if (projetoEditando) {
    setListaProjetos(listaProjetos.map((projeto) => projeto.id === projetoEditando.id ? { ...projeto, ...projetoAtualizado } : projeto));
  } else {
    setListaProjetos([...listaProjetos, { id: Date.now(), ...projetoAtualizado }]);
  }

  setNovoProjeto({ nome: "", empresa: "", descricao: "", membros: "" });
  setProjetoEditando(null);
  setMostrarFormulario(false);
}

  // Excluir um projeto da lista
  function excluirProjeto(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir este projeto?");

    if (confirmar) {
      setListaProjetos(listaProjetos.filter((projeto) => projeto.id !== id));
    }
  }

  // Abrir o formulário com os dados do projeto
  function editarProjeto(projeto) {
    setProjetoEditando(projeto);

    setNovoProjeto({
      nome: projeto.nome,
      empresa: projeto.empresa,
      descricao: projeto.descricao,
      membros: projeto.membros.join(", ")
    });

    setMostrarFormulario(true);
  }

  return (
    <div className="app">

      {/* Barra lateral */}
      <aside className="sidebar">
        <h1 className="logo">NEO</h1>

        <nav>
          <a href="#" className="menu-item active">Projetos</a>
          <a href="#" className="menu-item">Membros</a>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">

        <header className="header">
          <div>
            <h1>Hub de Projetos</h1>
            <p>Gerencie e acompanhe os projetos do NEO.</p>
          </div>

          <button
            className="new-project-button"
            onClick={() => setMostrarFormulario(true)}
          >
            + Novo projeto
          </button>
        </header>

        {/* Formulário de cadastro */}
        {mostrarFormulario && (
          <form className="project-form" onSubmit={cadastrarProjeto}>
            <h2>{projetoEditando ? "Editar projeto" : "Novo projeto"}</h2>

            <label>Nome do projeto</label>
            <input
              type="text"
              placeholder="Digite o nome do projeto"
              value={novoProjeto.nome}
              onChange={(e) => setNovoProjeto({...novoProjeto, nome: e.target.value})}
              required
            />

            <label>Empresa parceira</label>
            <select
              value={novoProjeto.empresa}
              onChange={(e) => setNovoProjeto({...novoProjeto, empresa: e.target.value})}
              required
            >
              <option value="">Selecione uma empresa</option>
              <option value="WEG">WEG</option>
              <option value="CERTI">CERTI</option>
              <option value="Embraco">Embraco</option>
              <option value="Landis+Gyr">Landis+Gyr</option>
            </select>

            <label>Descrição</label>
            <textarea
              placeholder="Descreva o projeto"
              value={novoProjeto.descricao}
              onChange={(e) => setNovoProjeto({...novoProjeto, descricao: e.target.value})}
              required
            />

            <label>Membros participantes</label>
            <input
              type="text"
              placeholder="Ex.: Maria, João, Ana"
              value={novoProjeto.membros}
              onChange={(e) => setNovoProjeto({...novoProjeto, membros: e.target.value})}
            />

            <div className="form-buttons">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>

              <button type="submit" className="save-button">
                Salvar projeto
              </button>
            </div>
          </form>
        )}

        {/* Seção de projetos */}
        <section className="projects-section">

          <div className="section-heading">
            <div>
              <h2>Projetos</h2>
              <p>Visualize e gerencie os projetos cadastrados.</p>
            </div>

            <span className="project-count">
              {projetosFiltrados.length} projetos
            </span>
          </div>

          {/* Pesquisa e filtro */}
          <div className="filters">
            <input
              type="text"
              placeholder="Pesquisar por projeto, empresa ou membro..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <select
              value={empresaSelecionada}
              onChange={(e) => setEmpresaSelecionada(e.target.value)}
            >
              <option value="Todas">Todas as empresas</option>
              <option value="WEG">WEG</option>
              <option value="CERTI">CERTI</option>
              <option value="Embraco">Embraco</option>
              <option value="Landis+Gyr">Landis+Gyr</option>
            </select>
          </div>

          {/* Cards dos projetos */}
          <div className="projects-grid">
            {projetosFiltrados.map((projeto) => (
              <div className="project-card" key={projeto.id}>

                <div className="card-header">
                  <span className="company-tag">{projeto.empresa}</span>

                  <div className="card-actions">
                    <button onClick={() => editarProjeto(projeto)} title="Editar">
                      ✎
                    </button>
                    <button onClick={() => excluirProjeto(projeto.id)} title="Excluir projeto">
                      ×
                    </button>
                  </div>
                </div>

                <h3>{projeto.nome}</h3>

                <p className="project-description">
                  {projeto.descricao}
                </p>

                <div className="card-footer">
                  <div className="members">
                    {projeto.membros.map((membro) => (
                      <span className="member-avatar" key={membro}>
                        {membro.charAt(0)}
                      </span>
                    ))}
                  </div>

                  <span className="member-count">
                    {projeto.membros.length} membros
                  </span>
                </div>

              </div>
            ))}
          </div>

          {/* Mensagem quando não encontrar projetos */}
          {projetosFiltrados.length === 0 && (
            <p className="empty-message">
              Nenhum projeto encontrado.
            </p>
          )}

        </section>
      </main>
    </div>
  )
}

export default App
