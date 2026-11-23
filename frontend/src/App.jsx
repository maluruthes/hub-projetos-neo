import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import GhostFibers from './components/GhostFibers'
import Sidebar from './components/Sidebar'
import Projects from './pages/Projects'
import Members from './pages/Members'
import Login from './pages/Login'
import Admin from './pages/Admin'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <div className="background-animation">
          <GhostFibers
            glowColor="#f17903"
            lineColor="#94a3b8"
            secondaryColor="#f28c28"
            layers={3}
            twist={1.2}
            threads={72}
            fiberStyle="dots"
            depthOfField={0.85}
            hoverEffect="focus"
            intro={true}
            mouseInteraction={true}
          />
        </div>

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Sidebar />

                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Projects />} />
                      <Route path="/membros" element={<Members />} />

                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <Admin />
                          </AdminRoute>
                        }
                      />

                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App
