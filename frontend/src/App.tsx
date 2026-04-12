import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Pedidos from "./pages/Pedidos"
import Kanban from "./pages/Kanban"
import Relatorios from "./pages/Relatorios"

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        
        {/* MENU LATERAL */}
        <div style={{
          width: "200px",
          padding: "20px",
          background: "#6C2BD9",
          color: "white",
          minHeight: "100vh"
        }}>
          
          {/* LOGO */}
          <img 
            src="/logo.png" 
            alt="LOGIX" 
            style={{ width: "120px", marginBottom: "20px" }}
          />

          <h3>LOGIX</h3>

          <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/" style={{ color: "white" }}>Dashboard</Link>
            <Link to="/pedidos" style={{ color: "white" }}>Pedidos</Link>
            <Link to="/kanban" style={{ color: "white" }}>Kanban</Link>
            <Link to="/relatorios" style={{ color: "white" }}>Relatórios</Link>
          </nav>
        </div>

        {/* CONTEÚDO */}
        <div style={{ padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  )
}

export default App