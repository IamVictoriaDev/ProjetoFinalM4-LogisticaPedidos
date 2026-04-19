import { prisma } from '../lib/prisma';

export interface CreateOrderProps {
  cliente: string; 
  produto: string;
  quantidade: number;
}

export class OrderService {
  async create({ cliente, produto, quantidade }: CreateOrderProps) {
    if (!cliente || !produto || !quantidade) {
      throw new Error("Dados insuficientes: 'cliente' (ID), 'produto' e 'quantidade' são obrigatórios.");
    }

    return await prisma.order.create({
      data: {
        cliente,
        produto,
        quantidade: Number(quantidade),
      }
    });
  }

  async list() {
    return await prisma.order.findMany({
      orderBy: { data: 'desc' }
    });
  }

  async findById(id: string) {
    if (!id) throw new Error("O ID do pedido é obrigatório.");
    
    const order = await prisma.order.findUnique({ where: { id } });
    
    if (!order) {
      throw new Error(`Busca falhou: O pedido com ID '${id}' não existe.`);
    }
    
    return order;
  }

  async findByCustomerId(clienteId: string) {
    if (!clienteId) throw new Error("O ID do cliente é obrigatório para o filtro.");
    
    return await prisma.order.findMany({
      where: { cliente: clienteId },
      orderBy: { data: 'desc' }
    });
  }

  async updateStatus(id: string, status: string) {
    if (!status) throw new Error("O novo status deve ser informado.");
    
    const orderExists = await prisma.order.findUnique({ where: { id } });
    if (!orderExists) throw new Error("Erro de atualização: Este pedido não foi encontrado.");

    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async delete(id: string) {
    const orderExists = await prisma.order.findUnique({ where: { id } });
    if (!orderExists) throw new Error("Erro ao deletar: Pedido inexistente.");

    return await prisma.order.delete({ where: { id } });
  }
}