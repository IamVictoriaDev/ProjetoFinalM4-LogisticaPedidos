import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Order } from "../types/order";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Upload, FileText, CheckCircle, AlertCircle,
  Download, Package, Truck, Users, ShoppingBag,
} from "lucide-react";

type UploadedRow = {
  cliente?: string;
  produto?: string;
  quantidade?: string | number;
  status?: string;
};

function limparDados(raw: unknown[]): UploadedRow[] {
  const resultado: UploadedRow[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const gestao = obj.gestao as Record<string, unknown> | undefined;
    const detalhes = obj.detalhes as Record<string, unknown> | undefined;
    const logistica = obj.logistica as Record<string, unknown> | undefined;
    const cliente = String(obj.cliente ?? gestao?.vendedor ?? gestao?.supervisor ?? "");
    const produto = String(obj.produto ?? detalhes?.servico ?? detalhes?.categoria ?? "");
    const quantidade = Number(obj.quantidade ?? detalhes?.quantidade ?? 0);
    const status = String(obj.status ?? logistica?.status ?? "");
    if (!cliente || !produto || quantidade <= 0) continue;
    resultado.push({ cliente, produto, quantidade, status });
  }
  return resultado;
}

export default function Relatorios() {
  const [uploadedData, setUploadedData] = useState<UploadedRow[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    },
  });

  const activeData: UploadedRow[] = useMemo(() => {
    if (uploadedData && uploadedData.length > 0) return uploadedData;
    return orders.map((o) => ({
      cliente: o.cliente,
      produto: o.produto,
      quantidade: o.quantidade,
      status: o.status,
    }));
  }, [uploadedData, orders]);

  const totalPedidos = activeData.length;
  const totalVolume = activeData.reduce((acc, o) => acc + Number(o.quantidade ?? 0), 0);
  const entregues = activeData.filter((o) => o.status === "Entregue" || o.status === "Concluído").length;
  const taxaEntrega = totalPedidos > 0 ? Math.round((entregues / totalPedidos) * 100) : 0;
  const clientesSet = new Set(activeData.map((o) => o.cliente));

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    activeData.forEach((o) => {
      const s = o.status || "Sem status";
      map[s] = (map[s] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [activeData]);

  const statusColors: Record<string, string> = {
    Recebido: "#3b82f6",
    "Em separação": "#f59e0b",
    "Em transporte": "#8b5cf6",
    Entregue: "#10b981",
    "Concluído": "#10b981",
    "Em Trânsito": "#8b5cf6",
    "Aguardando Retirada": "#f59e0b",
    Cancelado: "#ef4444",
    Pendente: "#6b7280",
  };

  const rankingProdutos = useMemo(() => {
    const map: Record<string, number> = {};
    activeData.forEach((o) => {
      const p = o.produto ?? "Desconhecido";
      map[p] = (map[p] ?? 0) + Number(o.quantidade ?? 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [activeData]);

  const rankingClientes = useMemo(() => {
    const map: Record<string, number> = {};
    activeData.forEach((o) => {
      const c = o.cliente ?? "Desconhecido";
      map[c] = (map[c] ?? 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [activeData]);

  const clientesInativos = useMemo(() => {
    const map: Record<string, string[]> = {};
    activeData.forEach((o) => {
      const c = o.cliente ?? "?";
      if (!map[c]) map[c] = [];
      if (o.status) map[c].push(o.status);
    });
    return Object.entries(map)
      .filter(([, s]) => !s.includes("Entregue") && !s.includes("Concluído"))
      .map(([c]) => c)
      .slice(0, 3);
  }, [activeData]);

  const maxVolume = rankingProdutos[0]?.[1] ?? 1;
  const maxCliente = rankingClientes[0]?.[1] ?? 1;
  const rankColors = ["#4f46e5", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];
  const rankBg = ["#ede9fe", "#d1fae5", "#fef3c7", "#dbeafe", "#ede9fe"];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let raw: unknown[] = [];
        if (file.name.endsWith(".json")) {
          raw = JSON.parse(text);
        } else if (file.name.endsWith(".csv")) {
          const lines = text.split("\n").filter((l) => l.trim());
          const headers = lines[0].split(",");
          raw = lines.slice(1).map((line) => {
            const vals = line.split(",");
            return headers.reduce((obj: Record<string, string>, h, i) => {
              obj[h.trim()] = vals[i]?.trim() ?? "";
              return obj;
            }, {});
          });
        }
        const limpos = limparDados(raw);
        setTimeout(() => { setUploadedData(limpos); setProcessing(false); }, 1000);
      } catch {
        alert("Erro ao processar arquivo.");
        setProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => { setUploadedData(null); setFileName(null); };

  const handleExportCSV = () => {
    const linhas = ["cliente,produto,quantidade,status",
      ...activeData.map((r) => `${r.cliente},${r.produto},${r.quantidade},${r.status}`)];
    const blob = new Blob([linhas.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-logix.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-gray-500 mt-1">
            {uploadedData ? `Exibindo dados de: ${fileName}` : "Análise operacional em tempo real"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalPedidos > 0 && (
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition shadow-sm">
              <Download size={15} />
              Exportar CSV
            </button>
          )}
          {uploadedData && (
            <button onClick={handleReset} className="text-sm text-gray-400 hover:text-red-500 transition underline">
              Limpar upload
            </button>
          )}
          <label className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold cursor-pointer transition shadow-sm">
            <Upload size={15} />
            {uploadedData ? "Novo arquivo" : "Importar dados"}
            <input type="file" accept=".json,.csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Processando */}
      {processing && (
        <div className="bg-white border border-indigo-100 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="text-indigo-600" size={18} />
            <p className="text-sm font-medium text-gray-700">Processando {fileName}...</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Badge */}
      {uploadedData && !processing && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-xl border border-green-200 w-fit mb-4">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">Arquivo processado com sucesso</span>
        </div>
      )}

      {/* Dashboard */}
      <div className="space-y-4">

        {/* Métricas */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: <Package size={20} />, val: totalPedidos, lbl: "Pedidos", bg: "#ede9fe", color: "#4f46e5" },
              { icon: <Truck size={20} />, val: totalVolume.toLocaleString("pt-BR"), lbl: "Volume", bg: "#dbeafe", color: "#2563eb" },
              { icon: <CheckCircle size={20} />, val: `${taxaEntrega}%`, lbl: "Entregues", bg: "#d1fae5", color: "#059669" },
              { icon: <Users size={20} />, val: clientesSet.size, lbl: "Clientes", bg: "#fef3c7", color: "#d97706" },
            ].map(({ icon, val, lbl, bg, color }) => (
              <div key={lbl} className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <span style={{ color }}>{icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-semibold" style={{ color }}>{val}</p>
                  <p className="text-sm text-gray-500">{lbl}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut + Produtos */}
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Pedidos por status</h3>
            <p className="text-xs text-gray-400 mb-4">Visão percentual dos pedidos</p>
            {pieData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Nenhum dado disponível</p>
            ) : (
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={statusColors[entry.name] ?? "#6366f1"} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", fontSize: 12 }}
                        formatter={(value, name) => [`${value} pedidos`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-900">{totalPedidos}</span>
                    <span className="text-xs text-gray-400">pedidos</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  {pieData.map((entry) => {
                    const pct = Math.round((entry.value / totalPedidos) * 100);
                    const color = statusColors[entry.name] ?? "#6366f1";
                    return (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-sm text-gray-600 flex-1">{entry.name}</span>
                        <span className="text-sm font-semibold text-gray-800">{entry.value}</span>
                        <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl p-6" style={{ background: "#eff6ff", border: "0.5px solid #bfdbfe" }}>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag size={14} color="#3b82f6" />
              <h3 className="font-semibold" style={{ color: "#1e40af" }}>Produtos mais pedidos</h3>
            </div>
            <p className="text-xs mb-5" style={{ color: "#3b82f6" }}>Itens com maior volume</p>
            {rankingProdutos.length === 0 ? (
              <p className="text-sm" style={{ color: "#3b82f6" }}>Nenhum dado ainda</p>
            ) : rankingProdutos.map(([produto, volume], i) => (
              <div key={produto} className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ background: rankBg[i], color: rankColors[i] }}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#1e40af" }}>{produto}</p>
                  <p className="text-xs" style={{ color: "#3b82f6" }}>{volume.toLocaleString("pt-BR")} un</p>
                </div>
                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(59,130,246,.15)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.round((volume / maxVolume) * 100)}%`, background: "#3b82f6" }} />
                </div>
                <span className="text-sm font-semibold w-10 text-right" style={{ color: "#1d4ed8" }}>{volume}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking + Alertas */}
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white border border-gray-100 border-l-4 rounded-r-2xl p-5 shadow-sm" style={{ borderLeftColor: "#4f46e5" }}>
            <h3 className="font-semibold text-gray-900 mb-1">Ranking de clientes</h3>
            <p className="text-xs text-gray-400 mb-3">Clientes com mais pedidos</p>
            {rankingClientes.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum dado ainda</p>
            ) : rankingClientes.map(([cliente, total], i) => (
              <div key={cliente} className="flex items-center gap-3 mb-2">
                <span className="text-xs font-semibold text-gray-400 w-4">{i + 1}</span>
                <span className="text-sm text-gray-700 flex-1 truncate">{cliente}</span>
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.round((total / maxCliente) * 100)}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-5 text-right">{total}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#fffbeb", border: "0.5px solid #fde68a" }}>
            <h3 className="font-semibold flex items-center gap-2 mb-1" style={{ color: "#92400e" }}>
              <AlertCircle size={14} color="#d97706" />
              Alertas
            </h3>
            <p className="text-xs mb-3" style={{ color: "#d97706" }}>Clientes sem pedido entregue</p>
            {clientesInativos.length === 0 ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-xl">
                <CheckCircle size={14} />
                <span className="text-sm">Tudo em dia!</span>
              </div>
            ) : clientesInativos.map((cliente, i) => (
              <div key={cliente} className="flex items-center gap-2 py-2" style={{ borderBottom: i < clientesInativos.length - 1 ? "0.5px solid #fde68a" : "none" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                <span className="text-sm flex-1" style={{ color: "#92400e" }}>{cliente}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fef3c7", color: "#d97706" }}>sem entrega</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}