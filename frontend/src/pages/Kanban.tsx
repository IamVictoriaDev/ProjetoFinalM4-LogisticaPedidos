import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
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
  { id: "recebido", title: "Recebido" },
  { id: "separacao", title: "Em separação" },
  { id: "transporte", title: "Em transporte" },
  { id: "entregue", title: "Entregue" },
];

export default function Kanban() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const { push } = useToast();

  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  function handleDragStart(event: any) {
    setActiveId(event.active?.id ?? null);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const previousStatus = active.data?.current?.status as OrderStatus | undefined;
    const targetStatus = (over.data?.current?.columnId ??
      over.id) as OrderStatus;

    if (!previousStatus || previousStatus === targetStatus) return;

    const orderId = String(active.id);

    updateStatus.mutate(
      { id: orderId, status: targetStatus },
      {
        onSuccess: () => {
          push({
            message: `Pedido PED-${orderId} movido para ${
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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Kanban</h1>
        {isLoading ? (
          <div>Carregando pedidos...</div>
        ) : (
          <div className="flex gap-4">
            {columns.map((column) => {
              const filteredOrders = orders.filter(
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
