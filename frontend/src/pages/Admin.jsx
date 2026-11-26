
import { useEffect, useState } from 'react'
import api from '../services/api'

function Admin() {
  const [usuarios, setUsuarios] = useState([])
  const [carregandoLista, setCarregandoLista] = useState(true)
  const [erroLista, setErroLista] = useState('')

  // Formulário de criação
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [criando, setCriando] = useState(false)

  // Edição
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [editUsername, setEditUsername] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('users')
  const [salvando, setSalvando] = useState(false)

  // Carrega todos os usuários
  async function carregarUsuarios() {
    setCarregandoLista(true)
    setErroLista('')

    try {
      const resposta = await api.get('users/')
      setUsuarios(resposta.data)
    } catch {
      setErroLista('Não foi possível carregar os usuários.')
    } finally {
      setCarregandoLista(false)
    }
  }

    useEffect(() => {
    let ativo = true

    async function buscarUsuariosInicial() {
        try {
        const resposta = await api.get('users/')

        if (ativo) {
            setUsuarios(resposta.data)
        }
        } catch {
        if (ativo) {
            setErroLista('Não foi possível carregar os usuários.')
        }
        } finally {
        if (ativo) {
            setCarregandoLista(false)
        }
        }
    }

    buscarUsuariosInicial()

    return () => {
        ativo = false
    }
    }, [])

  // Cria um novo usuário
  async function handleCriarUsuario(e) {
    e.preventDefault()

    setCriando(true)
    setMensagem('')
    setErro('')

    try {
      const resposta = await api.post('users/create/', {
        username,
        email,
        password,
      })

      setMensagem(`Usuário "${resposta.data.username}" criado com sucesso!`)

      setUsername('')
      setEmail('')
      setPassword('')

      await carregarUsuarios()
    } catch (error) {
      const dadosErro = error.response?.data

      if (dadosErro) {
        const primeiroErro = Object.values(dadosErro).flat()[0]
        setErro(String(primeiroErro || 'Não foi possível criar o usuário.'))
      } else {
        setErro('Não foi possível conectar ao servidor.')
      }
    } finally {
      setCriando(false)
    }
  }

  // Abre o formulário de edição
  function iniciarEdicao(usuario) {
    setUsuarioEditando(usuario.id)
    setEditUsername(usuario.username)
    setEditEmail(usuario.email)
    setEditRole(usuario.role)
  }

  // Salva as alterações
  async function handleSalvarEdicao(e) {
    e.preventDefault()

    setSalvando(true)
    setErro('')

    try {
      await api.patch(`users/${usuarioEditando}/`, {
        username: editUsername,
        email: editEmail,
        role: editRole,
      })

      setMensagem('Usuário atualizado com sucesso!')
      setUsuarioEditando(null)

      await carregarUsuarios()
    } catch (error) {
      const dadosErro = error.response?.data
      const primeiroErro = dadosErro
        ? Object.values(dadosErro).flat()[0]
        : null

      setErro(String(primeiroErro || 'Não foi possível atualizar o usuário.'))
    } finally {
      setSalvando(false)
    }
  }

  // Ativa ou desativa uma conta
  async function alternarStatus(usuario) {
    const novoStatus = !usuario.is_active

    const acao = novoStatus ? 'ativar' : 'desativar'

    if (!window.confirm(`Deseja realmente ${acao} o usuário ${usuario.username}?`)) {
      return
    }

    setErro('')
    setMensagem('')

    try {
      await api.patch(`users/${usuario.id}/`, {
        is_active: novoStatus,
      })

      setMensagem(
        `Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`
      )

      await carregarUsuarios()
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível alterar o status.')
    }
  }

  // Exclui uma conta
  async function handleExcluir(usuario) {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o usuário "${usuario.username}"? Essa ação não pode ser desfeita.`
    )

    if (!confirmar) return

    setErro('')
    setMensagem('')

    try {
      await api.delete(`users/${usuario.id}/`)

      setMensagem(`Usuário "${usuario.username}" excluído com sucesso!`)

      await carregarUsuarios()
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível excluir o usuário.')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <p>Gerencie os usuários do Hub de Projetos NEO</p>
      </div>
      {mensagem && <p className="admin-success">{mensagem}</p>}
      {erro && <p className="admin-error">{erro}</p>}

      {/* CADASTRO DE USUÁRIOS */}
      <section className="admin-section">
        <h2>Criar novo usuário</h2>

        <p>
          Cadastre uma nova conta para acessar a plataforma.
          O usuário criado terá o perfil padrão de usuário.
        </p>

        <form className="admin-form" onSubmit={handleCriarUsuario}>
          <label htmlFor="username">Nome de usuário</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite o nome de usuário"
            required
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o e-mail"
            required
          />

          <label htmlFor="password">Senha inicial</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha"
            required
          />

          <button type="submit" disabled={criando}>
            {criando ? 'Criando usuário...' : 'Criar usuário'}
          </button>
        </form>
      </section>

      {/* LISTAGEM DE USUÁRIOS */}
      <section className="admin-section">
        <div className="admin-list-header">
          <div>
            <h2>Usuários cadastrados</h2>
            <p>Total de contas: {usuarios.length}</p>
          </div>

          <button
            type="button"
            className="admin-refresh"
            onClick={carregarUsuarios}
          >
            Atualizar lista
          </button>
        </div>

        {carregandoLista ? (
          <p>Carregando usuários...</p>
        ) : erroLista ? (
          <p className="admin-error">{erroLista}</p>
        ) : usuarios.length === 0 ? (
          <p>Nenhum usuário cadastrado.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.username}</td>
                    <td>{usuario.email || '—'}</td>

                    <td>
                      <span className={`admin-role ${usuario.role}`}>
                        {usuario.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </td>

                    <td>
                      <span className={usuario.is_active ? 'status-active' : 'status-inactive'}>
                        {usuario.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          onClick={() => iniciarEdicao(usuario)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => alternarStatus(usuario)}
                        >
                          {usuario.is_active ? 'Desativar' : 'Ativar'}
                        </button>

                        <button
                          type="button"
                          className="admin-delete"
                          onClick={() => handleExcluir(usuario)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* FORMULÁRIO DE EDIÇÃO */}
      {usuarioEditando !== null && (
        <section className="admin-section">
          <h2>Editar usuário</h2>

          <form className="admin-form" onSubmit={handleSalvarEdicao}>
            <label htmlFor="editUsername">Nome de usuário</label>
            <input
              id="editUsername"
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              required
            />

            <label htmlFor="editEmail">E-mail</label>
            <input
              id="editEmail"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />

            <label htmlFor="editRole">Perfil</label>
            <select
              id="editRole"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            >
              <option value="users">Usuário</option>
              <option value="admin">Administrador</option>
            </select>

            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>

            <button
              type="button"
              className="admin-cancel"
              onClick={() => setUsuarioEditando(null)}
            >
              Cancelar
            </button>
          </form>
        </section>
      )}
    </div>
  )
}

export default Admin
