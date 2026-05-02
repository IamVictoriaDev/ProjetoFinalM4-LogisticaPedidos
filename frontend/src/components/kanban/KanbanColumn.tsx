import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
};

export default function KanbanColumn({ id, title, count, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      columnId: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      data-column={id}
      data-kanban-column
      className={`bg-gray-100 rounded-xl p-4 min-h-[400px] w-72 transition-shadow ${
        isOver ? "ring-2 ring-offset-2 ring-brandPurple-300 shadow-lg" : ""
      }`}
    >
      <h2 className="font-semibold mb-4">
        {title} ({count} pedidos)
      </h2>

      <div className="space-y-3">{children}</div>
    </div>
  );
}
