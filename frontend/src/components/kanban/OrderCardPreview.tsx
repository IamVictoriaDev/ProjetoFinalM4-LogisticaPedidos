import type { Order } from "../../types/order";
import { Package, Calendar } from "lucide-react";

const STATUS_STYLES: Record<string, { container: string; id: string }> = {
  recebido: {
    container: "bg-brandBlue-50 border-2 border-brandBlue-200",
    id: "bg-brandBlue-600 text-white ring-1 ring-white/40",
  },
  separacao: {
    container: "bg-brandOrange-50 border-2 border-brandOrange-200",
    id: "bg-brandOrange-600 text-white ring-1 ring-white/40",
  },
  transporte: {
    container: "bg-brandPurple-50 border-2 border-brandPurple-200",
    id: "bg-brandPurple-500 text-white ring-1 ring-white/40",
  },
  entregue: {
    container: "bg-brandGreen-50 border-2 border-brandGreen-200",
    id: "bg-brandGreen-600 text-white ring-1 ring-white/40",
  },
};

type Props = {
  order: Order;
};

export default function OrderCardPreview({ order }: Props) {
  const variant = STATUS_STYLES[order.status] ?? STATUS_STYLES.recebido;

  return (
    <div
      className={`rounded-2xl p-4 ${variant.container} shadow-2xl scale-105 w-80`}
      aria-hidden
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
