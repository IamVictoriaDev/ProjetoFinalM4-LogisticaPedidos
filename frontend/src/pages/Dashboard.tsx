import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { AlertCircle, Package, TrendingUp, Truck, CheckCircle, Clock } from "lucide-react";
import { api } from "../services/api";
import type { Order } from "../types/order";

export default function Dashboard() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    },
  });

  const hoje = new Date().toISOString().split("T")[0];

  const pedidosHoje   = useMemo(() => orders.filter((p) => p.data === hoje).length, [orders, hoje]);
  const aguardando    = useMemo(() => orders.filter((p) => p.status === "Recebido").length, [orders]);
  const emTransporte  = useMemo(() => orders.filter((p) => p.status === "Em transporte").length, [orders]);
  const entreguesHoje = useMemo(() => orders.filter((p) => p.status === "Entregue" && p.data === hoje).length, [orders, hoje]);

  const evolucaoPedidos = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      const data = o.data?.split("T")[0] ?? o.data;
      map[data] = (map[data] ?? 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([data, total]) => ({
        dia: new Date(data + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "short" }),
        pedidos: total,
      }));
  }, [orders]);

  const ultimosPedidos = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5);
  }, [orders]);

  const acoesPendentes = useMemo(() => {
    return orders
      .filter((p) => p.status === "Recebido" || p.status === "Em separação")
      .slice(0, 3);
  }, [orders]);

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    "Recebido":      { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
    "Em separação":  { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
    "Em transporte": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    "Entregue":      { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-400 text-sm">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-indigo-50/30 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 mt-1 text-sm">Visão operacional de hoje</p>
      </div>

      {/* KPI Cards — 2x2 no mobile, 4x1 no desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Pedidos Hoje",         value: pedidosHoje,   sub: "Últimas 24h",       color: "text-indigo-600", bgColor: "bg-indigo-50", icon: Package },
          { label: "Aguardando Separação", value: aguardando,    sub: "Status: Recebido",   color: "text-amber-500", bgColor: "bg-amber-50",  icon: Clock },
          { label: "Em Transporte",        value: emTransporte,  sub: "A caminho",           color: "text-purple-600", bgColor: "bg-purple-50", icon: Truck },
          { label: "Entregues Hoje",       value: entreguesHoje, sub: "Finalizados hoje",    color: "text-green-600", bgColor: "bg-green-50",  icon: CheckCircle },
        ].map(({ label, value, sub, color, bgColor, icon: Icon }) => (
          <div key={label} className="bg-white border border-indigo-100 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <p className="text-xs text-slate-400 font-medium leading-tight">{label}</p>
              <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={color} size={16} aria-hidden="true" />
              </div>
            </div>
            <p className={`text-3xl md:text-4xl font-bold leading-none mb-1 ${color}`}>{value}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Gráfico + Últimos pedidos — empilhados no mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        <div className="bg-white border border-indigo-100 rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-slate-900">Pedidos — últimos 7 dias</p>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} aria-hidden="true" />
              {orders.length} total
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Evolução diária</p>
          {evolucaoPedidos.length === 0 ? (
            <div className="h-36 flex items-center justify-center text-sm text-slate-400">
              Nenhum dado disponível
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={evolucaoPedidos} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="dia" stroke="#cbd5e1" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#cbd5e1" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e7ff", borderRadius: "8px", fontSize: 12 }} cursor={{ stroke: "#e0e7ff" }} />
                <Line type="monotone" dataKey="pedidos" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366f1" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-indigo-100 rounded-xl p-4 md:p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900 mb-1">Últimos Pedidos</p>
          <p className="text-xs text-slate-400 mb-4">Pedidos mais recentes</p>
          <div className="flex flex-col gap-2">
            {ultimosPedidos.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Nenhum pedido encontrado</p>
            ) : ultimosPedidos.map((pedido) => {
              const sc = statusConfig[pedido.status] ?? { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };
              return (
                <div key={pedido.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${sc.bg}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                  <p className="text-xs flex-1 text-slate-700 truncate">
                    <span className={`font-semibold ${sc.text}`}>{pedido.id}</span>
                    {" — "}{pedido.cliente}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${sc.bg} ${sc.text}`}>
                    {pedido.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ações pendentes */}
      <div className="bg-white border border-indigo-100 rounded-xl p-4 md:p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-900 mb-1">Ações Pendentes</p>
        <p className="text-xs text-slate-400 mb-4">Pedidos aguardando atenção</p>
        <div className="flex flex-col gap-2">
          {acoesPendentes.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl">
              <CheckCircle size={14} aria-hidden="true" />
              <span className="text-sm font-medium">Nenhuma ação pendente!</span>
            </div>
          ) : acoesPendentes.map((pedido) => {
            const urgente = pedido.status === "Recebido";
            return (
              <div
                key={pedido.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-2 ${
                  urgente ? "bg-amber-50 border-amber-400" : "bg-slate-50 border-slate-300"
                }`}
              >
                {urgente && <AlertCircle size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />}
                <p className="text-sm text-slate-700 flex-1 truncate">
                  <span className="font-semibold">{pedido.id}</span>
                  {" — "}{pedido.produto} · {pedido.cliente}
                </p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                  urgente ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {pedido.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}