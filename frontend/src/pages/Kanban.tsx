import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Search } from "lucide-react";
import KanbanColumn from "../components/kanban/KanbanColumn";
import OrderCard from "../components/kanban/OrderCard";
import OrderCardPreview from "../components/kanban/OrderCardPreview";
import { useOrders, useUpdateOrderStatus } from "../services/orders";
import { useToast } from "../store/useToast";
import type { Order, OrderStatus } from "../types/order";

type ColumnType = {
  id: OrderStatus;
  title: string;
};

const columns: ColumnType[] = [
  { id: "Recebido",      title: "Recebido" },
  { id: "Em separação",  title: "Em separação" },
  { id: "Em transporte", title: "Em transporte" },
  { id: "Entregue",      title: "Entregue" },
];

export default function Kanban() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const { push } = useToast();
  const [busca, setBusca] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  // Filtra pedidos por cliente, produto ou ID
  const ordersFiltrados = busca.trim()
    ? orders.filter((o) =>
        o.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        o.produto.toLowerCase().includes(busca.toLowerCase()) ||
        o.id.toLowerCase().includes(busca.toLowerCase())
      )
    : orders;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active?.id) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const previousStatus = active.data?.current?.status as OrderStatus | undefined;
    const targetStatus = (over.data?.current?.columnId ?? over.id) as OrderStatus;

    if (!previousStatus || previousStatus === targetStatus) return;

    const orderId = String(active.id);

    updateStatus.mutate(
      { id: orderId, status: targetStatus },
      {
        onSuccess: () => {
          push({
            message: `Pedido ${orderId} movido para ${
              columns.find((c) => c.id === targetStatus)?.title ?? "nova coluna"
            }`,
            actionLabel: "Desfazer",
            onAction: () => {
              updateStatus.mutate({ id: orderId, status: previousStatus });
            },
          });
        },
      },
    );
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="p-4 md:p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Kanban</h1>
            <p className="text-gray-500 text-sm mt-1">Acompanhe o fluxo operacional dos pedidos</p>
          </div>

          {/* Busca */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} aria-hidden="true" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar pedido, cliente..."
              aria-label="Buscar pedidos no Kanban"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"
            />
          </div>
        </div>

        {busca.trim() && (
          <p className="text-xs text-indigo-600 mb-4 ml-1">
            {ordersFiltrados.length} resultado(s) para "<strong>{busca}</strong>"
          </p>
        )}

        {isLoading ? (
          <div className="text-gray-400 text-sm">Carregando pedidos...</div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {columns.map((column) => {
                const filteredOrders = ordersFiltrados.filter(
                  (order) => order.status === column.id,
                );
                return (
                  <KanbanColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    count={filteredOrders.length}
                  >
                    {filteredOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        id={order.id}
                        cliente={order.cliente}
                        produto={order.produto}
                        quantidade={order.quantidade}
                        data={order.data}
                        status={order.status}
                      />
                    ))}
                  </KanbanColumn>
                );
              })}
            </div>
          </div>
        )}

        <DragOverlay>
          {activeId
            ? (() => {
                const activeOrder = orders.find(
                  (o: Order) => o.id === String(activeId),
                );
                return activeOrder ? (
                  <OrderCardPreview order={activeOrder} />
                ) : null;
              })()
            : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}