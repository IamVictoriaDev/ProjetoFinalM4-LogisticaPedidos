import { useDraggable } from "@dnd-kit/core";

type Props = {
  id: string;
  cliente: string;
};

export default function OrderCard({ id, cliente }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

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
      className="bg-white p-3 rounded-lg shadow cursor-grab"
    >
      {cliente}
    </div>
  );
}