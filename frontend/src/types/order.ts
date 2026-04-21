export type Order = {
  id: string;
  cliente: string;
  produto: string;
  quantidade: number;
  status: string;
  data: string;
  prioridade?: "low" | "medium" | "high";
  entregador?: string;
  valor?: number;
};
