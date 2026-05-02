import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  KanbanSquare,
  FileBarChart,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);

  const navItems = [
    { to: "/", label: "Dashboard", desc: "Visão geral", icon: LayoutDashboard, end: true },
    { to: "/pedidos", label: "Pedidos", desc: "Gerenciar pedidos", icon: Package, end: false },
    { to: "/kanban", label: "Kanban", desc: "Fluxo operacional", icon: KanbanSquare, end: false },
    { to: "/relatorios", label: "Relatórios", desc: "Análise de dados", icon: FileBarChart, end: false },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">

      {/* Overlay mobile */}
      {menuAberto && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-gradient-to-b from-brandPurple-700 via-brandFuchsia-500 to-brandPurple-600
        flex flex-col shadow-2xl
        transition-transform duration-300 ease-in-out
        ${menuAberto ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* Logo */}
        <div className="px-6 pt-8 pb-6 text-center border-b border-white/20">
          <img
            src="/logo1.png"
            alt="Logo LOGIX"
            className="w-40 mx-auto object-contain mb-3"
          />
          <p className="text-xs text-indigo-200 uppercase tracking-wide">
            Sistema de pedidos
          </p>
        </div>

        {/* Menu */}
        <nav className="px-4 pt-6 flex flex-col gap-2" aria-label="Menu principal">
          {navItems.map(({ to, label, desc, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                  isActive ? "bg-white" : "hover:bg-white/10"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-indigo-100" : "bg-white/15"}`}>
                    <Icon size={18} className={isActive ? "text-indigo-600" : "text-white"} aria-hidden="true" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold leading-none mb-0.5 ${isActive ? "text-indigo-700" : "text-white"}`}>{label}</p>
                    <p className={`text-xs ${isActive ? "text-indigo-400" : "text-indigo-300"}`}>{desc}</p>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="w-full h-px bg-white/20 mb-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={15} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Logix</p>
              <p className="text-xs text-indigo-300">v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 px-4 md:px-8 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between gap-4">

            {/* Botão hamburguer mobile */}
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-100 transition"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
            >
              {menuAberto ? <X size={20} className="text-neutral-600" /> : <Menu size={20} className="text-neutral-600" />}
            </button>

            <div className="flex-1" />

            {/* Avatar */}
            <div
              className="w-10 h-10 bg-gradient-to-br from-brandFuchsia-600 to-brandPurple-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              aria-label="Perfil do usuário"
            >
              <User size={20} className="text-white" aria-hidden="true" />
            </div>
          </div>
        </header>

        {/* Conteúdo das páginas */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-neutral-50 to-neutral-100" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}