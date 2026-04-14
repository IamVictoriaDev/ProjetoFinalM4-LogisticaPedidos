import type { FastifyInstance } from "fastify";
import { OrderController } from "../controllers/OrderController";

export async function OrderRouters(app: FastifyInstance){

    const orderController = new OrderController();

    app.post('/orders', orderController.create);
    app.get('/orders', orderController.list);
    app.get('/orders/:id', orderController.show);
    app.patch('/orders/:id', orderController.update);
    app.delete('/orders/:id', orderController.delete);

}