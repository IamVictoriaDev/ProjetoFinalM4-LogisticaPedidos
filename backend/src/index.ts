import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { OrderController } from './controllers/OrderController';

const app = Fastify({ logger: true });
const orderController = new OrderController();

async function start() {
  
  await app.register(cors, { origin: true });

  // --- DEFINIÇÃO DAS ROTAS  ---
  app.post('/orders', (req, rep) => orderController.create(req, rep));
  app.get('/orders', (req, rep) => orderController.list(req, rep));
  app.get('/orders/:id', (req, rep) => orderController.show(req, rep));
  
  // ROTA DE BUSCA POR CLIENTE 
  app.get('/orders/cliente/:clienteId', (req, rep) => orderController.listByCustomer(req, rep));
  
  app.patch('/orders/:id', (req, rep) => orderController.update(req, rep));
  app.delete('/orders/:id', (req, rep) => orderController.delete(req, rep));

  try {
   
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log("🚀 Backend Logix OPERACIONAL!");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();