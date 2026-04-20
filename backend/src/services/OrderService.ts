import { prisma } from '../lib/prisma';

export interface CreateOrderProps {
  cliente: string;
  produto: string;
  quantidade: number;
}

export class OrderService {
  async create({ cliente, produto, quantidade }: CreateOrderProps) {
    if (!cliente || !produto) throw new Error("Dados obrigatórios não preenchidos.");

    return await prisma.order.create({
      data: {
        cliente,
        produto,
        quantidade: Number(quantidade),
        status: "Recebido"
      }
    });
  }

  async list() {
    return await prisma.order.findMany({
      orderBy: { data: 'desc' }
    });
  }

  async findById(id: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new Error("Pedido não encontrado.");
    return order;
  }

  async updateStatus(id: string, status: string) {
    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async delete(id: string) {
    return await prisma.order.delete({ where: { id } });
  }
}