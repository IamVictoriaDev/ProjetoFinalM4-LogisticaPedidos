import { api } from "./api";
import type { Order } from "../types/order";

type CreateOrderDTO = Omit<Order, "id" | "data">;

export async function getOrders(): Promise<Order[]> {
  const response = await api.get("/orders");
  return response.data;
}

export async function createOrder(order: CreateOrderDTO): Promise<Order> {
  const response = await api.post("/orders", order);
  return response.data;
}

export async function updateOrder(order: Order): Promise<Order> {
  const response = await api.patch(`/orders/${order.id}`, {
    cliente: order.cliente,
    produto: order.produto,
    quantidade: order.quantidade,
    status: order.status,
  });
  return response.data;
}

export async function deleteOrder(id: string) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}