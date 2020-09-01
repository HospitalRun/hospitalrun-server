import Fastify from 'fastify'
import app from './app'

const port = Number(process.env.PORT) || 3000
const ip = process.env.IP || 'localhost'

const fastify = Fastify({
  ignoreTrailingSlash: true,
  logger: true,
})

fastify.register(app)

fastify.listen(port, ip, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
