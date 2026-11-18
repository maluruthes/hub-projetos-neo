import { NavLink } from 'react-router-dom'

function Sidebar() {
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
      </nav>
    </aside>
  )
}

export default Sidebar
