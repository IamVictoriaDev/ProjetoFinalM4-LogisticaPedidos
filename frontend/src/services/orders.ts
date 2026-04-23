import axios from "axios";
import type { Order, NovoPedidoForm } from "../types/order";

const API = axios.create({ baseURL: "/api" });

export async function getOrders(): Promise<Order[]> {
  const { data } = await API.get("/orders");
  return data;
}

export async function createOrder(order: NovoPedidoForm): Promise<Order> {
  const { data } = await API.post("/orders", order);
  return data;
}

export async function updateOrder(id: string, order: NovoPedidoForm,): Promise<Order> {
  const { data } = await API.put(`/orders/${id}`, order);
  return data;
}

export async function patchOrderStatus(id: string, status: string) {
  const { data } = await API.patch(`/orders/${id}`, { status });
  return data;
}

export async function deleteOrder(id: string) {
  const { data } = await API.delete(`/orders/${id}`);
  return data;
}