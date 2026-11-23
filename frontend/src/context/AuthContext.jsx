import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Recupera a sessão ao atualizar a página
  useEffect(() => {
    const access = sessionStorage.getItem('access')

    if (!access) {
      setCarregando(false)
      return
    }

    api.get('users/me/')
      .then(response => {
        setUsuario(response.data)
      })
      .catch(() => {
        sessionStorage.removeItem('access')
        sessionStorage.removeItem('refresh')
        setUsuario(null)
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  // Escuta o encerramento automático da sessão
  useEffect(() => {
    function encerrarSessao() {
      setUsuario(null)
    }

    window.addEventListener('auth:logout', encerrarSessao)

    return () => {
      window.removeEventListener('auth:logout', encerrarSessao)
    }
  }, [])

  // Realiza login
  async function login(username, password) {
    const response = await api.post('token/', {
      username,
      password,
    })

    sessionStorage.setItem('access', response.data.access)
    sessionStorage.setItem('refresh', response.data.refresh)

    try {
      const perfil = await api.get('users/me/')
      setUsuario(perfil.data)
      return perfil.data
    } catch (error) {
      sessionStorage.removeItem('access')
      sessionStorage.removeItem('refresh')
      throw error
    }
  }

  // Realiza logout
  function logout() {
    sessionStorage.removeItem('access')
    sessionStorage.removeItem('refresh')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        login,
        logout,
        isAdmin: usuario?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
