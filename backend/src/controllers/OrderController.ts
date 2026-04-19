import { FastifyRequest, FastifyReply } from 'fastify';
import { OrderService, CreateOrderProps } from '../services/OrderService';

const orderService = new OrderService();

interface OrderParams {
  id: string;
}

interface CustomerParams {
  clienteId: string;
}

interface UpdateBody {
  status: string;
}

export class OrderController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as CreateOrderProps;
    try {
      const order = await orderService.create(body);
      return reply.status(201).send(order);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: "Erro de Cadastro", message: errorMessage });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const orders = await orderService.list();
    return reply.send(orders);
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as OrderParams;
    try {
      const order = await orderService.findById(id);
      return reply.send(order);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(404).send({ error: "Não Encontrado", message: errorMessage });
    }
  }

  async listByCustomer(request: FastifyRequest, reply: FastifyReply) {
    const { clienteId } = request.params as CustomerParams;
    try {
      const orders = await orderService.findByCustomerId(clienteId);
      if (orders.length === 0) {
        return reply.send({ 
          message: `Nenhum pedido vinculado ao ID de cliente: ${clienteId}`, 
          orders: [] 
        });
      }
      return reply.send(orders);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: "Erro de Filtro", message: errorMessage });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as OrderParams;
    const { status } = request.body as UpdateBody;
    try {
      const order = await orderService.updateStatus(id, status);
      return reply.send(order);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: "Erro de Update", message: errorMessage });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as OrderParams;
    try {
      await orderService.delete(id);
      return reply.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: "Erro de Exclusão", message: errorMessage });
    }
  }
}