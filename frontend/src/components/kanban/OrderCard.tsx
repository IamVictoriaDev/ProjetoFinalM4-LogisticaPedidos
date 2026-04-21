import { useDraggable } from "@dnd-kit/core";
import type { Order } from "../../types/order";
import { Package, Calendar } from "lucide-react";

type Props = {
  order: Order;
};

const STATUS_STYLES: Record<string, { container: string; id: string }> = {
  Recebido: {
    container: "bg-brandBlue-50 border-2 border-brandBlue-200",
    id: "bg-brandBlue-600 text-white ring-1 ring-white/40",
  },
  "Em separação": {
    container: "bg-brandOrange-50 border-2 border-brandOrange-200",
    id: "bg-brandOrange-600 text-white ring-1 ring-white/40",
  },
  "Em transporte": {
    container: "bg-brandPurple-50 border-2 border-brandPurple-200",
    id: "bg-brandPurple-500 text-white ring-1 ring-white/40",
  },
  Entregue: {
    container: "bg-brandGreen-50 border-2 border-brandGreen-200",
    id: "bg-brandGreen-600 text-white ring-1 ring-white/40",
  },
};

export default function OrderCard({ order }: Props) {
  const variant = STATUS_STYLES[order.status] ?? STATUS_STYLES.Recebido;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: order.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-order-id={order.id}
      role="listitem"
      tabIndex={0}
      aria-grabbed={isDragging}
      className={`kanban-card rounded-2xl p-4 ${variant.container} shadow-md cursor-grab ${isDragging ? "opacity-90" : "hover:shadow-lg"} transition-transform duration-150 ease-out`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2">
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${variant.id}`}
            >
              PED-{order.id}
            </span>
          </div>
          <h4 className="text-lg font-semibold text-neutral-900 mb-3">
            {order.cliente}
          </h4>

          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-3 py-1 text-xs text-neutral-700 max-w-max">
              <Package size={14} className="text-neutral-600" />
              <span className="truncate">{order.produto}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-neutral-600 flex items-center gap-2">
            <Calendar size={14} />
            <span>{new Date(order.data).toLocaleDateString()}</span>
          </div>
          <div className="bg-white/90 text-xs text-neutral-800 px-2 py-1 rounded-md">
            {order.quantidade} un
          </div>
        </div>
      </div>
    </div>
  );
}
