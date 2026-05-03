import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, X, Search } from "lucide-react";
import type { Order, NovoPedidoForm } from "../types/order";
import { useOrders, useCreateOrder, useUpdateOrder, useDeleteOrder } from "../services/orders";

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<string, string> = {
    "Recebido":      "bg-blue-500 text-white",
    "Em separação":  "bg-orange-500 text-white",
    "Em transporte": "bg-purple-500 text-white",
    "Entregue":      "bg-green-500 text-white",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styles[status] ?? "bg-gray-500 text-white"}`}>
      {status}
    </span>
  );
}

// Modal FORA do componente Pedidos para evitar perda de foco
function PedidoModal({
  titulo,
  onClose,
  onSalvar,
  form,
  setForm,
  isPending,
  isError,
}: {
  titulo: string;
  onClose: () => void;
  onSalvar: () => void;
  form: NovoPedidoForm;
  setForm: (v: NovoPedidoForm) => void;
  isPending: boolean;
  isError: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition" aria-label="Fechar modal">
          <X size={22} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{titulo}</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1.5">Nome do Cliente</label>
            <input
              value={form.cliente}
              onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1.5">Produto</label>
            <input
              value={form.produto}
              onChange={(e) => setForm({ ...form, produto: e.target.value })}
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1.5">Quantidade</label>
            <input
              value={form.quantidade}
              onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })}
              type="number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Order["status"] })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
            >
              <option value="Recebido">Recebido</option>
              <option value="Em separação">Em separação</option>
              <option value="Em transporte">Em transporte</option>
              <option value="Entregue">Entregue</option>
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm">
              Cancelar
            </button>
            <button onClick={onSalvar} disabled={isPending}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm">
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
          {isError && <p className="text-red-500 text-sm">Erro ao salvar pedido.</p>}
        </div>
      </div>
    </div>
  );
}

export default function Pedidos() {
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState<Order | null>(null);

  const [form, setForm] = useState<NovoPedidoForm>({
    cliente: "", produto: "", quantidade: 0, status: "Recebido",
  });
  const [formEdicao, setFormEdicao] = useState<NovoPedidoForm>({
    cliente: "", produto: "", quantidade: 0, status: "Recebido",
  });

  const { data: pedidos = [], isLoading } = useOrders();
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const deleteMutation = useDeleteOrder();

  const pedidosFiltrados = useMemo(() => {
    if (!busca.trim()) return pedidos;
    const termo = busca.toLowerCase();
    return pedidos.filter(
      (p) =>
        p.cliente.toLowerCase().includes(termo) ||
        p.produto.toLowerCase().includes(termo) ||
        p.id.toLowerCase().includes(termo)
    );
  }, [pedidos, busca]);

  const abrirModal = () => {
    setForm({ cliente: "", produto: "", quantidade: 0, status: "Recebido" });
    setModalAberto(true);
  };

  const abrirModalEdicao = (pedido: Order) => {
    setPedidoEditando(pedido);
    setFormEdicao({
      cliente: pedido.cliente,
      produto: pedido.produto,
      quantidade: pedido.quantidade,
      status: pedido.status,
    });
    setModalEdicaoAberto(true);
  };

  const handleCriarPedido = () => {
    if (!form.cliente.trim() || !form.produto.trim()) {
      alert("Preencha todos os campos.");
      return;
    }
    createMutation.mutate(form, { onSuccess: () => setModalAberto(false) });
  };

  const handleSalvarEdicao = () => {
    if (!formEdicao.cliente.trim() || !formEdicao.produto.trim()) {
      alert("Preencha todos os campos.");
      return;
    }
    if (!pedidoEditando) return;
    updateMutation.mutate(
      { id: pedidoEditando.id, ...formEdicao },
      { onSuccess: () => { setModalEdicaoAberto(false); setPedidoEditando(null); } }
    );
  };

  const handleExcluir = (pedido: Order) => {
    if (!confirm(`Deseja excluir o pedido ${pedido.id}?`)) return;
    deleteMutation.mutate(pedido.id);
  };

  return (
    <div className="w-full p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 mt-1 text-sm">Gerencie todos os pedidos</p>
        </div>
        <button onClick={abrirModal}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold px-4 py-2.5 md:px-5 md:py-3 rounded-xl shadow-md text-sm whitespace-nowrap">
          <Plus size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Novo Pedido</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} aria-hidden="true" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por cliente, produto ou ID..."
            aria-label="Buscar pedidos"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"
          />
        </div>
        {busca.trim() && (
          <p className="text-xs text-indigo-600 mt-2 ml-1">
            {pedidosFiltrados.length} resultado(s) para "<strong>{busca}</strong>"
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-gray-500 text-sm">Carregando pedidos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-700 text-xs md:text-sm font-semibold">
                  <th className="px-4 md:px-6 py-3 md:py-4">ID</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Cliente</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Produto</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Qtd</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Status</th>
                  <th className="px-4 md:px-6 py-3 md:py-4">Data</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 md:px-6 py-4 font-semibold text-gray-800 text-sm">{pedido.id}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm max-w-[120px] truncate">{pedido.cliente}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm max-w-[120px] truncate">{pedido.produto}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{pedido.quantidade}</td>
                    <td className="px-4 md:px-6 py-4"><StatusBadge status={pedido.status} /></td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm whitespace-nowrap">
                      {new Date(pedido.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => abrirModalEdicao(pedido)} className="text-blue-600 hover:text-blue-800 transition" aria-label={`Editar pedido ${pedido.id}`}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleExcluir(pedido)} className="text-red-600 hover:text-red-800 transition" aria-label={`Excluir pedido ${pedido.id}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pedidosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                      {busca.trim() ? `Nenhum pedido encontrado para "${busca}"` : "Nenhum pedido encontrado."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && (
          <div className="px-4 md:px-6 py-4 text-sm text-gray-500 bg-white">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </div>
        )}
      </div>

      {modalAberto && (
        <PedidoModal
          titulo="Novo Pedido"
          onClose={() => setModalAberto(false)}
          onSalvar={handleCriarPedido}
          form={form}
          setForm={setForm}
          isPending={createMutation.isPending}
          isError={createMutation.isError}
        />
      )}

      {modalEdicaoAberto && pedidoEditando && (
        <PedidoModal
          titulo="Editar Pedido"
          onClose={() => { setModalEdicaoAberto(false); setPedidoEditando(null); }}
          onSalvar={handleSalvarEdicao}
          form={formEdicao}
          setForm={setFormEdicao}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}
    </div>
  );
}