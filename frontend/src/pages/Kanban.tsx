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
import type { Order } from "../types/order";

type ColumnType = {
  id: string;
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

    // otimista: atualizar via mutation
    updateStatus.mutate({ id: String(active.id), status: String(over.id) });
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
