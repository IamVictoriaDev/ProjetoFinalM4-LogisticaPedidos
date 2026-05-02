import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import Kanban from "./pages/Kanban";
import Relatorios from "./pages/Relatorios";
import Toast from "./components/kanban/Toast";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="kanban" element={<Kanban />} />
            <Route path="relatorios" element={<Relatorios />} />
          </Route>
        </Routes>
        <Toast />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
