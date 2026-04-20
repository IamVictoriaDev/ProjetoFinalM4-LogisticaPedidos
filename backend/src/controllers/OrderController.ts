import { FastifyRequest, FastifyReply } from 'fastify';
import { OrderService, CreateOrderProps, UpdateOrderProps } from '../services/OrderService';

const orderService = new OrderService();


interface OrderParams {
  id: string;
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
    const body = request.body as UpdateOrderProps;
    try {
      const order = await orderService.update(id, body);
      return reply.send(order);
    } catch (error) {
      return reply.status(400).send({ message: "Falha ao atualizar o pedido." });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as OrderParams;
    try {
      await orderService.delete(id);
      return reply.send({ message: "Pedido removido com sucesso!" });
    } catch (error: any) {
      if (error?.code === "P2025") {
        return reply.status(404).send({ message: "Pedido não encontrado para exclusão." });
      }

      return reply.status(400).send({ message: "Erro ao tentar remover o pedido." });
    }
  }
}