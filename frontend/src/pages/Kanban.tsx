import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import KanbanColumn from "../components/kanban/KanbanColumn";
import OrderCard from "../components/kanban/OrderCard";
import OrderCardPreview from "../components/kanban/OrderCardPreview";
import { useState } from "react";
import { useOrders, useUpdateOrderStatus } from "../services/orders";
import type { Order } from "../types/order";
import Toast from "../components/kanban/Toast";
import { useToast } from "../store/useToast";

const STATUSES = [
  { key: "Recebido", title: "Recebido" },
  { key: "Em separação", title: "Em separação" },
  { key: "Em transporte", title: "Em transporte" },
  { key: "Entregue", title: "Entregue" },
];

function normalizeOrders(raw: unknown): Order[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as Order[];
  // common wrappers
  if (typeof raw === "object") {
    const r = raw as any;
    if (Array.isArray(r.data)) return r.data as Order[];
    if (Array.isArray(r.orders)) return r.orders as Order[];
  }
  return [];
}

export default function Kanban() {
  const { data, isLoading } = useOrders();
  const orders = normalizeOrders(data);
  const update = useUpdateOrderStatus();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const { push } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);

  const ordersByStatus: Record<string, Order[]> = STATUSES.reduce(
    (acc, s) => ({ ...acc, [s.key]: [] }),
    {} as Record<string, Order[]>,
  );

  orders.forEach((o) => {
    if (!ordersByStatus[o.status]) ordersByStatus[o.status] = [];
    ordersByStatus[o.status].push(o);
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    // if dropped on column id, update status
    const dest = over.id as string;
    const id = active.id as string;
    // prevent if same
    const current = (orders as Order[]).find((o) => o.id === id);
    if (!current) return;
    if (current.status === dest) return;
    const from = current.status;
    update.mutate({ id, status: dest });

    // show undo toast via store
    push({
      message: `Pedido ${id} movido para ${dest}`,
      actionLabel: "Desfazer",
      onAction: () => update.mutate({ id, status: from }),
    });
    setActiveId(null);
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.remove("is-dragging");
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.add("is-dragging");
    }
  }
  function handleDragCancel() {
    setActiveId(null);
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.remove("is-dragging");
    }
  }

  // toasts are handled by central store (useToast)

  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Kanban</h2>
      <p className="text-sm text-neutral-600 mb-6">
        Acompanhe o fluxo operacional dos pedidos
      </p>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex gap-6 overflow-x-auto pb-8">
            {STATUSES.map((s) => (
              <KanbanColumn
                key={s.key}
                id={s.key}
                title={s.title}
                count={ordersByStatus[s.key]?.length ?? 0}
              >
                {ordersByStatus[s.key]?.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </KanbanColumn>
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <OrderCardPreview
                order={(orders as Order[]).find((x) => x.id === activeId)!}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      <Toast />
    </div>
  );
}
