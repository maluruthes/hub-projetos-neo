import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api/'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Controla a renovação do token para evitar várias renovações simultâneas
let renovacaoEmAndamento = null

// Adiciona o token automaticamente
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Trata erros de autenticação e renova o token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const requisicaoOriginal = error.config

    if (
      error.response?.status !== 401 ||
      !requisicaoOriginal ||
      requisicaoOriginal._retry ||
      requisicaoOriginal.url?.includes('token/')
    ) {
      return Promise.reject(error)
    }

    requisicaoOriginal._retry = true

    const refresh = sessionStorage.getItem('refresh')

    if (!refresh) {
      sessionStorage.removeItem('access')
      sessionStorage.removeItem('refresh')
      window.dispatchEvent(new Event('auth:logout'))

      return Promise.reject(error)
    }

    try {
      if (!renovacaoEmAndamento) {
        renovacaoEmAndamento = axios.post(
          `${API_URL}token/refresh/`,
          { refresh }
        )
      }

      const resposta = await renovacaoEmAndamento
      const novoAccess = resposta.data.access

      sessionStorage.setItem('access', novoAccess)

      requisicaoOriginal.headers.Authorization = `Bearer ${novoAccess}`

      return api(requisicaoOriginal)

    } catch (erroRefresh) {
      sessionStorage.removeItem('access')
      sessionStorage.removeItem('refresh')
      window.dispatchEvent(new Event('auth:logout'))

      return Promise.reject(erroRefresh)

    } finally {
      renovacaoEmAndamento = null
    }
  }
)

export default api
