
import { useState, useEffect } from 'react'
import api from '../services/api'

function Members() {
  const [listaMembros, setListaMembros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [membroEditando, setMembroEditando] = useState(null)

  const [novoMembro, setNovoMembro] = useState({
    name: '',
    email: '',
    role: '',
    photo_url: ''
  })

  // Buscar membros
  async function carregarMembros() {
    try {
      setErro('')

      const resposta = await api.get('members/')

      const dados = Array.isArray(resposta.data)
        ? resposta.data
        : resposta.data.results || []

      setListaMembros(dados)
    } catch (error) {
      console.error('Erro ao carregar membros:', error)
      setErro('Não foi possível carregar os membros.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarMembros()
  }, [])

  // Filtrar membros
  const membrosFiltrados = listaMembros.filter((membro) => {
    const texto = busca.toLowerCase()

    return (
      (membro.name || '').toLowerCase().includes(texto) ||
      (membro.email || '').toLowerCase().includes(texto) ||
      (membro.role || '').toLowerCase().includes(texto)
    )
  })

  // Abrir formulário para novo membro
  function novoCadastro() {
    setMembroEditando(null)
    setNovoMembro({
      name: '',
      email: '',
      role: '',
      photo_url: ''
    })
    setMostrarFormulario(true)
  }

  // Cadastrar ou editar membro
  async function salvarMembro(e) {
    e.preventDefault()

    try {
      let resposta

      if (membroEditando) {
        resposta = await api.patch(
          `members/${membroEditando.id}/`,
          novoMembro
        )

        setListaMembros((lista) =>
          lista.map((membro) =>
            membro.id === membroEditando.id
              ? resposta.data
              : membro
          )
        )

        alert('Membro atualizado com sucesso!')
      } else {
        resposta = await api.post('members/', novoMembro)

        setListaMembros((lista) => [...lista, resposta.data])

        alert('Membro cadastrado com sucesso!')
      }

      cancelarFormulario()
    } catch (error) {
      console.error('Erro ao salvar membro:', error.response?.data || error)
      alert('Não foi possível salvar o membro. Verifique os dados.')
    }
  }

  // Editar membro
  function editarMembro(membro) {
    setMembroEditando(membro)

    setNovoMembro({
      name: membro.name || '',
      email: membro.email || '',
      role: membro.role || '',
      photo_url: membro.photo_url || ''
    })

    setMostrarFormulario(true)
  }

  // Excluir membro
  async function excluirMembro(id) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este membro?'
    )

    if (confirmar) {
      try {
        await api.delete(`members/${id}/`)

        setListaMembros((lista) =>
          lista.filter((membro) => membro.id !== id)
        )

        alert('Membro excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir membro:', error.response?.data || error)
        alert('Não foi possível excluir o membro.')
      }
    }
  }

  // Fechar e limpar formulário
  function cancelarFormulario() {
    setNovoMembro({
      name: '',
      email: '',
      role: '',
      photo_url: ''
    })

    setMembroEditando(null)
    setMostrarFormulario(false)
  }

  return (
    <div className="members-page">

      <header className="header">
        <div>
          <span className="page-eyebrow">NEO · EQUIPE</span>
          <h1>Membros</h1>
          <p>Conheça e gerencie as pessoas que fazem parte do NEO.</p>
        </div>

        <button
          className="new-project-button"
          onClick={novoCadastro}
        >
          + Novo membro
        </button>
      </header>

      {/* Resumo da equipe */}
      <section className="members-summary">
        <div className="summary-icon">👥</div>

        <div>
          <span>Total de membros</span>
          <strong>{listaMembros.length}</strong>
        </div>
      </section>

      {/* Formulário */}
      {mostrarFormulario && (
        <form className="project-form member-form" onSubmit={salvarMembro}>
          <div className="form-heading">
            <div>
              <span className="page-eyebrow">CADASTRO DA EQUIPE</span>
              <h2>{membroEditando ? 'Editar membro' : 'Novo membro'}</h2>
            </div>
          </div>

          <div className="member-form-grid">
            <div className="form-field">
              <label>Sigla</label>
              <input
                type="text"
                placeholder="Ex.: Maria Silva"
                value={novoMembro.name}
                onChange={(e) =>
                  setNovoMembro({
                    ...novoMembro,
                    name: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-field">
              <label>Cargo</label>
              <input
                type="text"
                placeholder="Ex.: Desenvolvedora"
                value={novoMembro.role}
                onChange={(e) =>
                  setNovoMembro({
                    ...novoMembro,
                    role: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-field">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="nome@email.com"
                value={novoMembro.email}
                onChange={(e) =>
                  setNovoMembro({
                    ...novoMembro,
                    email: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-field">
              <label>URL da foto <span>(opcional)</span></label>
              <input
                type="url"
                placeholder="https://..."
                value={novoMembro.photo_url}
                onChange={(e) =>
                  setNovoMembro({
                    ...novoMembro,
                    photo_url: e.target.value
                  })
                }
              />
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={cancelarFormulario}
            >
              Cancelar
            </button>

            <button type="submit" className="save-button">
              Salvar membro
            </button>
          </div>
        </form>
      )}

      {/* Lista de membros */}
      <section className="members-section">
        <div className="section-heading">
          <div>
            <h2>Nossa equipe</h2>
            <p>Visualize as informações dos membros cadastrados.</p>
          </div>

          <span className="project-count">
            {membrosFiltrados.length} encontrados
          </span>
        </div>

        {/* Pesquisa */}
        <div className="members-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Pesquisar por nome, e-mail ou cargo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          {busca && (
            <button onClick={() => setBusca('')} title="Limpar pesquisa">
              ×
            </button>
          )}
        </div>

        {carregando && <p className="empty-message">Carregando membros...</p>}

        {erro && <p className="empty-message">{erro}</p>}

        <div className="members-grid">
          {membrosFiltrados.map((membro) => (
            <article className="member-card" key={membro.id}>
              <div className="member-card-top">
                {membro.photo_url ? (
                  <img
                    src={membro.photo_url}
                    alt={membro.name}
                    className="member-photo"
                  />
                ) : (
                  <div className="member-photo-placeholder">
                    {(membro.name || '?').charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="member-actions">
                  <button
                    onClick={() => editarMembro(membro)}
                    title="Editar membro"
                  >
                    ✎
                  </button>

                  <button
                    onClick={() => excluirMembro(membro.id)}
                    title="Excluir membro"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="member-info">
                <h3>{membro.name}</h3>
                <span className="member-role">{membro.role}</span>
                <p className="member-email">{membro.email}</p>
              </div>

              <div className="member-card-footer">
                <span>MEMBRO NEO</span>
                <span className="member-status">
                  <span></span>
                  Cadastrado
                </span>
              </div>
            </article>
          ))}
        </div>

        {!carregando && membrosFiltrados.length === 0 && !erro && (
          <p className="empty-message">
            {busca
              ? 'Nenhum membro encontrado para essa pesquisa.'
              : 'Nenhum membro cadastrado.'}
          </p>
        )}
      </section>
    </div>
  )
}

export default Members
