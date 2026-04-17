import Fastify from "fastify";
import cors from "@fastify/cors";
import { OrderRouters } from "./routers/route";

const app = Fastify({ logger: true });

async function start() {
  await app.register(cors, { origin: true });

  await app.register(OrderRouters);

  try {
    await app.listen({ port: 3333 });
    console.log("🚀 Backend Logix operacional em http://localhost:3333");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();