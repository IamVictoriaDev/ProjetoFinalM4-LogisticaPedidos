import Fastify from 'fastify';
import cors from '@fastify/cors';
import { OrderController } from './controllers/OrderController';

const app = Fastify({ logger: true });

async function start() {
 
  await app.register(cors, { origin: true });

  try {
    await app.listen({ port: 3333 });
    console.log("🚀 Backend Logix operacional em http://localhost:3333");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();