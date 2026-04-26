import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  KanbanSquare,
  FileBarChart,
  Search,
  User,
} from "lucide-react";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 via-purple-600 to-purple-700 flex flex-col shadow-2xl">

        {/* Logo */}
        <div className="px-6 pt-8 pb-6 text-center border-b border-white/20">
          <img
            src="/logo1.png"
            alt="Logo"
            className="w-40 mx-auto object-contain mb-3"
          />
          <p className="text-xs text-indigo-200 uppercase tracking-wide">
            Sistema de pedidos
          </p>
        </div>

        {/* Menu agrupado no topo */}
        <nav className="px-4 pt-6 flex flex-col gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                isActive ? "bg-white" : "hover:bg-white/10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-indigo-100" : "bg-white/15"}`}>
                  <LayoutDashboard size={18} className={isActive ? "text-indigo-600" : "text-white"} />
                </div>
                <div>
                  <p className={`text-sm font-semibold leading-none mb-0.5 ${isActive ? "text-indigo-700" : "text-white"}`}>Dashboard</p>
                  <p className={`text-xs ${isActive ? "text-indigo-400" : "text-indigo-300"}`}>Visão geral</p>
                </div>
              </>
            )}
          </NavLink>

          <NavLink
            to="/pedidos"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                isActive ? "bg-white" : "hover:bg-white/10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-indigo-100" : "bg-white/15"}`}>
                  <Package size={18} className={isActive ? "text-indigo-600" : "text-white"} />
                </div>
                <div>
                  <p className={`text-sm font-semibold leading-none mb-0.5 ${isActive ? "text-indigo-700" : "text-white"}`}>Pedidos</p>
                  <p className={`text-xs ${isActive ? "text-indigo-400" : "text-indigo-300"}`}>Gerenciar pedidos</p>
                </div>
              </>
            )}
          </NavLink>

          <NavLink
            to="/kanban"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                isActive ? "bg-white" : "hover:bg-white/10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-indigo-100" : "bg-white/15"}`}>
                  <KanbanSquare size={18} className={isActive ? "text-indigo-600" : "text-white"} />
                </div>
                <div>
                  <p className={`text-sm font-semibold leading-none mb-0.5 ${isActive ? "text-indigo-700" : "text-white"}`}>Kanban</p>
                  <p className={`text-xs ${isActive ? "text-indigo-400" : "text-indigo-300"}`}>Fluxo operacional</p>
                </div>
              </>
            )}
          </NavLink>

          <NavLink
            to="/relatorios"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                isActive ? "bg-white" : "hover:bg-white/10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-indigo-100" : "bg-white/15"}`}>
                  <FileBarChart size={18} className={isActive ? "text-indigo-600" : "text-white"} />
                </div>
                <div>
                  <p className={`text-sm font-semibold leading-none mb-0.5 ${isActive ? "text-indigo-700" : "text-white"}`}>Relatórios</p>
                  <p className={`text-xs ${isActive ? "text-indigo-400" : "text-indigo-300"}`}>Análise de dados</p>
                </div>
              </>
            )}
          </NavLink>
        </nav>

        {/* Espaço vazio para decidir depois */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="w-full h-px bg-white/20 mb-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Logix</p>
              <p className="text-xs text-indigo-300">v1.0.0</p>
            </div>
          </div>
        </div>

      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar pedidos, clientes..."
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gradient-to-br from-neutral-50 to-neutral-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}