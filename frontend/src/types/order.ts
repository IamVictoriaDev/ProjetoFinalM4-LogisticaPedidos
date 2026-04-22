export type Order = {
  id: string;
  cliente: string;
  produto: string;
  quantidade: number;
  status: string;
  data: string;
}
export type NovoPedidoForm = {
  cliente: string;
  produto: string;
  quantidade: number;
  status: Order["status"];
};