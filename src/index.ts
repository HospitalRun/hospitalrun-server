import Fastify from 'fastify'
import app from './app'
import mongoose from 'mongoose'

const port = Number(process.env.PORT) || 3000
const ip = process.env.IP || 'localhost'

const fastify = Fastify({
  ignoreTrailingSlash: true,
  logger: true,
})

fastify.register(app)

mongoose
  .connect(process.env.DB_URL as string, { useNewUrlParser: true })
  .then(() => fastify.log.info('Connected to MongoDB running on ' + process.env.DB_URL))
  .catch((err) => fastify.log.error(err))

fastify.listen(port, ip, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
