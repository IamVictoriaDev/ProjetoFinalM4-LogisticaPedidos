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
      {/* Sidebar com gradiente roxo */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 via-purple-600 to-purple-700 flex flex-col shadow-2xl">

        {/* Logo  */}
        <div className="px-6 py-8">
        
          <div className="flex justify-center mb-4">
        
            <div className="text-center">
              <h1 
                className="text-3xl font-bold text-white tracking-wider" 
                style={{ fontFamily: "'Poppins', 'Inter', sans-serif", letterSpacing: '0.1em' }}
              >
                LOGIX
              </h1>
            </div>
          </div>

          {/* Subtítulo */}
          <p className="text-sm text-indigo-200 text-center uppercase tracking-wide mb-4">
            Sistema de pedidos
          </p>

          {/* Linha inferior */}
          <div className="w-full h-[1px] bg-white/30"></div>
        </div>

        {/* Espaçamento maior antes do menu */}
        <div className="h-24"></div>

        {/* Menu com mais espaço entre itens */}
        <nav className="flex-1 px-4 space-y-4">
          
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/pedidos"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <Package size={20} />
            <span>Pedidos</span>
          </NavLink>

          <NavLink
            to="/kanban"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <KanbanSquare size={20} />
            <span>Kanban</span>
          </NavLink>

          <NavLink
            to="/relatorios"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <FileBarChart size={20} />
            <span>Relatórios</span>
          </NavLink>

        </nav>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={20}
                />
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

        {/* Páginas */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-neutral-50 to-neutral-100">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
