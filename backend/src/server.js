const fastify = require('fastify')()
const cors = require('@fastify/cors')

fastify.register(cors)

// rota base (teste)
fastify.get('/', async () => {
  return { message: 'API funcionando 🚀' }
})

fastify.listen({ port: 3333 }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('Servidor rodando na porta 3333')
})