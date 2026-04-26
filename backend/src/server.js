const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");

const STATUS = {
  RECEBIDO: "recebido",
  SEPARACAO: "separacao",
  TRANSPORTE: "transporte",
  ENTREGUE: "entregue",
};

const VALID_STATUS = new Set(Object.values(STATUS));

let orders = [
  {
    id: "001",
    cliente: "Supermercado Central",
    produto: "Arroz 5kg",
    quantidade: 200,
    status: STATUS.RECEBIDO,
    data: "2026-04-09",
  },
  {
    id: "002",
    cliente: "Mercearia Silva",
    produto: "Feijao 1kg",
    quantidade: 150,
    status: STATUS.RECEBIDO,
    data: "2026-04-09",
  },
  {
    id: "003",
    cliente: "Atacado Sao Paulo",
    produto: "Oleo de Soja 900ml",
    quantidade: 300,
    status: STATUS.SEPARACAO,
    data: "2026-04-08",
  },
  {
    id: "004",
    cliente: "Mercado Bom Preco",
    produto: "Acucar 1kg",
    quantidade: 180,
    status: STATUS.SEPARACAO,
    data: "2026-04-08",
  },
  {
    id: "005",
    cliente: "Distribuidora Norte",
    produto: "Cafe 500g",
    quantidade: 250,
    status: STATUS.TRANSPORTE,
    data: "2026-04-07",
  },
  {
    id: "006",
    cliente: "Minimercado Vitoria",
    produto: "Macarrao 500g",
    quantidade: 120,
    status: STATUS.TRANSPORTE,
    data: "2026-04-07",
  },
  {
    id: "007",
    cliente: "Supermercado Estrela",
    produto: "Farinha de Trigo 1kg",
    quantidade: 200,
    status: STATUS.ENTREGUE,
    data: "2026-04-06",
  },
  {
    id: "008",
    cliente: "Mercado Popular",
    produto: "Leite Longa Vida 1L",
    quantidade: 300,
    status: STATUS.ENTREGUE,
    data: "2026-04-05",
  },
  {
    id: "009",
    cliente: "Atacado Recife",
    produto: "Sal 1kg",
    quantidade: 100,
    status: STATUS.ENTREGUE,
    data: "2026-04-04",
  },
];

fastify.register(cors, {
  origin: true,
});

fastify.get("/", async () => {
  return { message: "API funcionando" };
});

fastify.get("/orders", async () => {
  return orders;
});

fastify.patch("/orders/:id", async (request, reply) => {
  const { id } = request.params;
  const { status } = request.body;

  if (!status || !VALID_STATUS.has(status)) {
    return reply.status(400).send({
      error: "Status invalido",
      validStatus: Array.from(VALID_STATUS),
    });
  }

  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return reply.status(404).send({ error: "Pedido nao encontrado" });
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
  };

  return orders[orderIndex];
});

fastify.listen({ port: 3333, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info("Servidor rodando na porta 3333");
});