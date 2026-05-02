import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { Order } from "../types/order";

// ─── Funções base ─────────────────────────────────────────────────────────────

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await api.get("/orders");
  return data;
}

// ─── Hook: buscar pedidos ─────────────────────────────────────────────────────

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 1000 * 30,
  });
}

// ─── Hook: criar pedido ───────────────────────────────────────────────────────

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: Omit<Order, "id" | "data">) => {
      const { data } = await api.post("/orders", order);
      return data as Order;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ─── Hook: editar pedido completo ─────────────────────────────────────────────

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: Omit<Order, "data">) => {
      const { data } = await api.patch(`/orders/${order.id}`, {
        cliente: order.cliente,
        produto: order.produto,
        quantidade: order.quantidade,
        status: order.status,
      });
      return data as Order;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ─── Hook: deletar pedido ─────────────────────────────────────────────────────

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/orders/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ─── Hook: atualizar só o status (Kanban) ────────────────────────────────────

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation<
    Order,
    Error,
    { id: string; status: Order["status"] },
    { previous?: Order[] }
  >({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.patch(`/orders/${id}`, { status });
      return data;
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["orders"] });
      const previous = qc.getQueryData<Order[]>(["orders"]);
      if (previous) {
        qc.setQueryData<Order[]>(["orders"], (old) =>
          old ? old.map((o) => (o.id === id ? { ...o, status } : o)) : old,
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(["orders"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}