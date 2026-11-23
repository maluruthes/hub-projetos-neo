import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Sidebar() {
  const { isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src="/LogoNEO_horiz_transp_inv.png" alt="Logo NEO" />
      </div>

      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'menu-item active' : 'menu-item'
          }
        >
          Projetos
        </NavLink>

        <NavLink
          to="/membros"
          className={({ isActive }) =>
            isActive ? 'menu-item active' : 'menu-item'
          }
        >
          Membros
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? 'menu-item active' : 'menu-item'
            }
          >
            Administração
          </NavLink>
        )}
      </nav>

      <button className="menu-item logout-button" onClick={handleLogout}>
        Sair
      </button>
    </aside>
  )
}

export default Sidebar
