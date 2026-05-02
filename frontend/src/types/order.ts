export type OrderStatus =
  | "Recebido"
  | "Em separação"
  | "Em transporte"
  | "Entregue";

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

export type NovoPedidoForm = {
  cliente: string;
  produto: string;
  quantidade: number;
  status: OrderStatus;
};