import { prisma } from '../lib/prisma';

// Definindo o que o pedido precisa ter
export interface CreateOrderProps {
  cliente: string;
  phone: string;
  description: string;
  totalValue: number;
}

export class OrderService {
  async create({ cliente, phone, description, totalValue }: CreateOrderProps) {
    if (!cliente || !phone) throw new Error("Dados obrigatórios não preenchidos.");

    return await prisma.order.create({
      data: {
        cliente,
        phone,
        description,
        totalValue: Number(totalValue),
        status: "PENDENTE"
      }
    });
  }

  async list() {
    return await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
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