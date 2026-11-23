import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Adiciona o token de acesso automaticamente nas requisições
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Tenta renovar o token quando ele expira
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const requisicaoOriginal = error.config

    if (
      error.response?.status === 401 &&
      !requisicaoOriginal._retry &&
      !requisicaoOriginal.url.includes('token/')
    ) {
      requisicaoOriginal._retry = true

      const refresh = sessionStorage.getItem('refresh')

      if (!refresh) {
        sessionStorage.removeItem('access')
        sessionStorage.removeItem('refresh')
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(error)
      }

      try {
        const resposta = await axios.post(
          'http://127.0.0.1:8000/api/token/refresh/',
          { refresh }
        )

        const novoAccess = resposta.data.access

        sessionStorage.setItem('access', novoAccess)

        requisicaoOriginal.headers.Authorization = `Bearer ${novoAccess}`

        return api(requisicaoOriginal)
      } catch (erroRefresh) {
        sessionStorage.removeItem('access')
        sessionStorage.removeItem('refresh')
        window.dispatchEvent(new Event('auth:logout'))

        return Promise.reject(erroRefresh)
      }
    }

    return Promise.reject(error)
  }
)

export default api
