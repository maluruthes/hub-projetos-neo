import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Projects from './pages/Projects'
import Members from './pages/Members'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/membros" element={<Members />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
