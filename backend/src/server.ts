import Fastify from 'fastify'
import { todoRoutes } from './routes.js'

const app = Fastify({ logger: true })

app.register(todoRoutes)

app.listen({ port: 3000, host: '127.0.0.1' }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
