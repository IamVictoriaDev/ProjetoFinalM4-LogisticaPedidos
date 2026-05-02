import { useDraggable } from "@dnd-kit/core";
import { Calendar, Package } from "lucide-react";
import type { OrderStatus } from "../../types/order";

const STATUS_STYLES: Record<OrderStatus, { container: string; id: string }> = {
  "Recebido": {
    container: "bg-brandBlue-50 border-2 border-brandBlue-200",
    id: "bg-brandBlue-600 text-white",
  },
  "Em separação": {
    container: "bg-brandOrange-50 border-2 border-brandOrange-200",
    id: "bg-brandOrange-600 text-white",
  },
  "Em transporte": {
    container: "bg-brandPurple-50 border-2 border-brandPurple-200",
    id: "bg-brandPurple-500 text-white",
  },
  "Entregue": {
    container: "bg-brandGreen-50 border-2 border-brandGreen-200",
    id: "bg-brandGreen-600 text-white",
  },
};

type Props = {
  id: string;
  cliente: string;
  produto: string;
  quantidade: number;
  data: string;
  status: OrderStatus;
};

export default function OrderCard({
  id,
  cliente,
  produto,
  quantidade,
  data,
  status,
}: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      status,
      columnId: status,
    },
  });

  const variant = STATUS_STYLES[status];

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-order-id={id}
      data-column={status}
      className={`p-4 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing ${variant.container}`}
    >
      <div className="mb-3">
        <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${variant.id}`}>
          PED-{id}
        </span>
      </div>
      <h4 className="text-2xl font-semibold text-neutral-900 mb-4">{cliente}</h4>
      <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-3 py-1 text-sm text-neutral-700 w-full mb-4">
        <Package size={14} className="text-neutral-600" />
        <span className="truncate">{produto}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span className="inline-flex items-center gap-2">
          <Calendar size={14} />
          {new Date(data).toLocaleDateString()}
        </span>
        <span className="bg-white/90 text-neutral-800 px-2 py-1 rounded-md text-xs">
          {quantidade} un
        </span>
      </div>
    </div>
  );
}