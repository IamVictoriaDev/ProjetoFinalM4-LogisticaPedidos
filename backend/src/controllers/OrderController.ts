import { FastifyRequest, FastifyReply } from 'fastify';
import { OrderService, CreateOrderProps } from '../services/OrderService';

const orderService = new OrderService();


interface OrderParams {
  id: string;
}


interface UpdateStatusBody {
  status: string;
}

export class OrderController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      
      const body = request.body as CreateOrderProps; 
      const order = await orderService.create(body);
      return reply.status(201).send(order);
    } catch (error) {
      return reply.status(400).send({ message: "Não foi possível criar o pedido." });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const orders = await orderService.list();
      return reply.send(orders);
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao carregar a lista de pedidos." });
    }
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as OrderParams;
    try {
      const order = await orderService.findById(id);
      return reply.send(order);
    } catch (error) {
      return reply.status(404).send({ message: "Pedido não localizado." });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as OrderParams;
    const { status } = request.body as UpdateStatusBody;
    try {
      const order = await orderService.updateStatus(id, status);
      return reply.send({ message: "Status atualizado!", order });
    } catch (error) {
      return reply.status(400).send({ message: "Falha ao atualizar o status." });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as OrderParams;
    try {
      await orderService.delete(id);
      return reply.send({ message: "Pedido removido com sucesso!" });
    } catch (error) {
      return reply.status(400).send({ message: "Erro ao tentar remover o pedido." });
    }
  }
}