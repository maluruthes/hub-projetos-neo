import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function AdminRoute({ children }) {
  const { usuario, carregando, isAdmin } = useAuth()

  if (carregando) {
    return <p>Carregando...</p>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
