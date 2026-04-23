import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order, NovoPedidoForm } from "../types/order";
import { getOrders, createOrder, updateOrder, deleteOrder, patchOrderStatus, } from "../services/orders";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 30,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...order }: { id: string } & NovoPedidoForm) => 
        updateOrder(id, order),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      patchOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}