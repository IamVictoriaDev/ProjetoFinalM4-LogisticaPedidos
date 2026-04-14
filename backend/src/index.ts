import Fastify from 'fastify';
import cors from '@fastify/cors';
import { OrderController } from './controllers/OrderController';

const app = Fastify({ logger: true });
const orderController = new OrderController();

async function start() {
 
  await app.register(cors, { origin: true });

  // --- DEFINIÇÃO DAS ROTAS ---
  app.post('/orders', orderController.create);
  app.get('/orders', orderController.list);
  app.get('/orders/:id', orderController.show);
  app.patch('/orders/:id', orderController.update);
  app.delete('/orders/:id', orderController.delete);

  try {
    await app.listen({ port: 3333 });
    console.log("🚀 Backend Logix operacional em http://localhost:3333");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();