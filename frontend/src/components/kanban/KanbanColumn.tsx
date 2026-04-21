import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  title: string;
  count?: number;
  children?: React.ReactNode;
};

export default function KanbanColumn({ id, title, count, children }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id, data: { type: "column" } });

  return (
    <div className={`w-80 flex flex-col min-h-[220px]`}>
      <div className="mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3
              id={`col-${id}`}
              className="text-sm font-semibold text-neutral-800"
            >
              {title}
            </h3>
            <div className="text-xs text-neutral-500">{count ?? 0} pedidos</div>
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        data-column={id}
        role="list"
        aria-labelledby={`col-${id}`}
        className={`flex-1 space-y-4 overflow-auto ${isOver ? "ring-2 ring-brandPurple-300/60 rounded-xl" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
