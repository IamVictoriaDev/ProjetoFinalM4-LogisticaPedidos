import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order } from "../types/order";

const API = axios.create({ baseURL: "/api" });

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await API.get("/orders");
  return data;
}

export async function patchOrderStatus(id: string, status: string) {
  const { data } = await API.patch(`/orders/${id}`, { status });
  return data;
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 1000 * 30,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation<
    Order,
    Error,
    { id: string; status: string },
    { previous?: Order[] }
  >({
    mutationFn: ({ id, status }) => patchOrderStatus(id, status),
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
