import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import type { Order, NovoPedidoForm } from "../types/order";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, createOrder, deleteOrder } from "../services/orders";

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles =
    status === "Recebido"
      ? "bg-blue-500 text-white"
      : status === "Em separação"
      ? "bg-orange-500 text-white"
      : "bg-purple-500 text-white";

  return (
    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${styles}`}>
      {status}
    </span>
  );
}

export default function Pedidos() {
  const queryClient = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState<NovoPedidoForm>({
    cliente: "",
    produto: "",
    quantidade: 0,
    status: "Recebido",
  });

  const { data: pedidos, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setModalAberto(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const abrirModal = () => {
    setForm({
      cliente: "",
      produto: "",
      quantidade: 0,
      status: "Recebido",
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const handleCriarPedido = () => {
    if (!form.cliente.trim() || !form.produto.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    createMutation.mutate(form);
  };

  const handleEditar = (pedido: Order) => {
    alert(`Editar pedido: ${pedido.id}`);
  };

  const handleExcluir = (pedido: Order) => {
    const confirmar = confirm(`Deseja excluir o pedido ${pedido.id}?`);
    if (!confirmar) return;

    deleteMutation.mutate(pedido.id);
  };

  return (
    <div className="w-full p-8 bg-gray-50 min-h-screen relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 mt-1">Gerencie todos os pedidos</p>
        </div>

        <button
          onClick={abrirModal}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold px-5 py-3 rounded-xl shadow-md"
        >
          <Plus size={20} />
          Novo Pedido
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-gray-500">Carregando pedidos...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-700 text-sm font-semibold">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Quantidade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {pedidos?.map((pedido) => (
                <tr
                  key={pedido.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-5 font-semibold text-gray-800">
                    {pedido.id}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {pedido.cliente}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {pedido.produto}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {pedido.quantidade}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={pedido.status} />
                  </td>

                  <td className="px-6 py-5 text-gray-700">{pedido.data}</td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEditar(pedido)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleExcluir(pedido)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pedidos?.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {!isLoading && (
          <div className="px-6 py-4 text-sm text-gray-500 bg-white">
            Mostrando {pedidos?.length ?? 0} pedidos
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white w-[520px] rounded-2xl shadow-xl p-10 relative">
            <button
              onClick={fecharModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Novo Pedido
            </h2>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Nome do Cliente
                </label>
                <input
                  value={form.cliente}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, cliente: e.target.value }))
                  }
                  type="text"
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Produto
                </label>
                <input
                  value={form.produto}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, produto: e.target.value }))
                  }
                  type="text"
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Quantidade
                </label>
                <input
                  value={form.quantidade}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      quantidade: Number(e.target.value),
                    }))
                  }
                  type="number"
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as Order["status"],
                    }))
                  }
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Recebido">Recebido</option>
                  <option value="Em separação">Em separação</option>
                  <option value="Em transporte">Em transporte</option>
                </select>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={fecharModal}
                  className="w-1/2 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleCriarPedido}
                  disabled={createMutation.isPending}
                  className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {createMutation.isPending ? "Criando..." : "Criar"}
                </button>
              </div>

              {createMutation.isError && (
                <p className="text-red-500 text-sm mt-2">
                  Erro ao criar pedido.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}