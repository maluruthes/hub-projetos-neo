import { useState, useEffect } from 'react'
import api from '../services/api'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'

function Projects() {
  const [busca, setBusca] = useState('')
  const [empresaSelecionada, setEmpresaSelecionada] = useState('Todas')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [projetoEditando, setProjetoEditando] = useState(null)

  const [novoProjeto, setNovoProjeto] = useState({
    nome: '',
    empresa: '',
    descricao: '',
    membros: ''
  })

  const [listaProjetos, setListaProjetos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [listaMembros, setListaMembros] = useState([])

  // Buscar projetos
  useEffect(() => {
    async function carregarProjetos() {
      try {
        const resposta = await api.get('projects/')

        const dados = Array.isArray(resposta.data)
          ? resposta.data
          : resposta.data.results || []

        const projetosFormatados = dados.map((projeto) => ({
          id: projeto.id,
          nome: projeto.name || '',
          empresa: projeto.partner_company || '',
          descricao: projeto.description || '',
          membros: (projeto.members || []).map((membro) => membro.name)
        }))

        setListaProjetos(projetosFormatados)
      } catch (error) {
        console.error('Erro ao carregar projetos:', error)
        setErro('Não foi possível carregar os projetos.')
      } finally {
        setCarregando(false)
      }
    }

    carregarProjetos()
  }, [])

  // Buscar membros
  useEffect(() => {
    async function carregarMembros() {
      try {
        const resposta = await api.get('members/')

        const dados = Array.isArray(resposta.data)
          ? resposta.data
          : resposta.data.results || []

        setListaMembros(dados)
      } catch (error) {
        console.error('Erro ao carregar membros:', error)
      }
    }

    carregarMembros()
  }, [])

  // Indicadores do dashboard
  const totalProjetos = listaProjetos.length

  const totalEmpresas = new Set(
    listaProjetos
      .map((projeto) => projeto.empresa)
      .filter((empresa) => empresa)
  ).size

  const totalMembrosEnvolvidos = new Set(
    listaProjetos.flatMap((projeto) => projeto.membros)
  ).size

  const projetosSemMembros = listaProjetos.filter(
    (projeto) => projeto.membros.length === 0
  ).length

  // Filtrar projetos
  const projetosFiltrados = listaProjetos.filter((projeto) => {
    const textoBusca = busca.toLowerCase()

    const correspondeBusca =
      projeto.nome.toLowerCase().includes(textoBusca) ||
      projeto.empresa.toLowerCase().includes(textoBusca) ||
      projeto.membros.some((membro) =>
        membro.toLowerCase().includes(textoBusca)
      )

    const correspondeEmpresa =
      empresaSelecionada === 'Todas' ||
      projeto.empresa === empresaSelecionada

    return correspondeBusca && correspondeEmpresa
  })

  // Abrir formulário de novo projeto
  function novoCadastro() {
    setProjetoEditando(null)
    setNovoProjeto({
      nome: '',
      empresa: '',
      descricao: '',
      membros: ''
    })
    setMostrarFormulario(true)
  }

  // Cadastrar ou editar
  async function cadastrarProjeto(e) {
    e.preventDefault()

    try {
      const nomesDigitados = novoProjeto.membros
        .split(',')
        .map((membro) => membro.trim())
        .filter((membro) => membro !== '')

      const membrosNaoEncontrados = nomesDigitados.filter((nome) =>
        !listaMembros.some(
          (membro) => membro.name.toLowerCase() === nome.toLowerCase()
        )
      )

      if (membrosNaoEncontrados.length > 0) {
        alert(
          `Membro(s) não encontrado(s): ${membrosNaoEncontrados.join(', ')}`
        )
        return
      }

      const memberIds = nomesDigitados.map((nome) =>
        listaMembros.find(
          (membro) => membro.name.toLowerCase() === nome.toLowerCase()
        ).id
      )

      const dadosProjeto = {
        name: novoProjeto.nome,
        partner_company: novoProjeto.empresa,
        description: novoProjeto.descricao,
        member_ids: memberIds
      }

      let resposta

      if (projetoEditando) {
        resposta = await api.patch(
          `projects/${projetoEditando.id}/`,
          dadosProjeto
        )
      } else {
        resposta = await api.post('projects/', dadosProjeto)
      }

      const projetoFormatado = {
        id: resposta.data.id,
        nome: resposta.data.name || '',
        empresa: resposta.data.partner_company || '',
        descricao: resposta.data.description || '',
        membros: (resposta.data.members || []).map(
          (membro) => membro.name
        )
      }

      if (projetoEditando) {
        setListaProjetos((lista) =>
          lista.map((projeto) =>
            projeto.id === projetoEditando.id
              ? projetoFormatado
              : projeto
          )
        )

        alert('Projeto atualizado com sucesso!')
      } else {
        setListaProjetos((lista) => [...lista, projetoFormatado])
        alert('Projeto cadastrado com sucesso!')
      }

      setNovoProjeto({
        nome: '',
        empresa: '',
        descricao: '',
        membros: ''
      })

      setProjetoEditando(null)
      setMostrarFormulario(false)

    } catch (error) {
      console.error('Erro ao salvar projeto:', error.response?.data || error)
      alert('Não foi possível salvar o projeto. Verifique os dados.')
    }
  }

  // Excluir projeto
  async function excluirProjeto(id) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este projeto?'
    )

    if (confirmar) {
      try {
        await api.delete(`projects/${id}/`)

        setListaProjetos((lista) =>
          lista.filter((projeto) => projeto.id !== id)
        )

        alert('Projeto excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir projeto:', error)
        alert('Não foi possível excluir o projeto.')
      }
    }
  }

  // Editar projeto
  function editarProjeto(projeto) {
    setProjetoEditando(projeto)

    setNovoProjeto({
      nome: projeto.nome,
      empresa: projeto.empresa,
      descricao: projeto.descricao,
      membros: projeto.membros.join(', ')
    })

    setMostrarFormulario(true)
  }

  return (
    <>
      <header className="header">
        <div>
          <h1>Hub de Projetos</h1>
          <p>Gerencie e acompanhe os projetos do NEO.</p>
        </div>

        <button
          className="new-project-button"
          onClick={novoCadastro}
        >
          + Novo projeto
        </button>
      </header>

      {mostrarFormulario && (
        <ProjectForm
          novoProjeto={novoProjeto}
          setNovoProjeto={setNovoProjeto}
          listaMembros={listaMembros}
          projetoEditando={projetoEditando}
          cadastrarProjeto={cadastrarProjeto}
          setMostrarFormulario={setMostrarFormulario}
        />
      )}

      {/* Indicadores */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">▦</div>
          <div>
            <p className="stat-label">Total de projetos</p>
            <h3 className="stat-value">{totalProjetos}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⌂</div>
          <div>
            <p className="stat-label">Empresas parceiras</p>
            <h3 className="stat-value">{totalEmpresas}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">♙</div>
          <div>
            <p className="stat-label">Membros envolvidos</p>
            <h3 className="stat-value">{totalMembrosEnvolvidos}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">!</div>
          <div>
            <p className="stat-label">Sem membros alocados</p>
            <h3 className="stat-value">{projetosSemMembros}</h3>
          </div>
        </div>
      </section>

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

        {carregando && <p>Carregando projetos...</p>}

        {erro && <p className="empty-message">{erro}</p>}

        <div className="projects-grid">
          {projetosFiltrados.map((projeto) => (
            <ProjectCard
              key={projeto.id}
              projeto={projeto}
              editarProjeto={editarProjeto}
              excluirProjeto={excluirProjeto}
            />
          ))}
        </div>

        {projetosFiltrados.length === 0 && !carregando && !erro && (
          <p className="empty-message">
            Nenhum projeto encontrado.
          </p>
        )}
      </section>
    </>
  )
}

export default Projects
