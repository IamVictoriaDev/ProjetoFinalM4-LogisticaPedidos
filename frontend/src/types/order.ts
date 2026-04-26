export type OrderStatus = "recebido" | "separacao" | "transporte" | "entregue";

export type Order = {
  id: string;
  cliente: string;
  produto: string;
  quantidade: number;
  status: OrderStatus;
  data: string;
  prioridade?: "low" | "medium" | "high";
  entregador?: string;
  valor?: number;
};
