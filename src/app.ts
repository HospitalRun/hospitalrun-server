import { Server, IncomingMessage, ServerResponse } from 'http'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyAutoload from 'fastify-autoload'
import { join } from 'path'
import GQL from 'fastify-gql'
import schema from './graphql/schema'
import resolvers from './graphql/resolvers'

export default (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  _: FastifyPluginOptions,
  next: (error?: Error) => void,
) => {
  fastify.register(fastifyCors, {
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
  fastify.register(fastifyHelmet)
  fastify.register(fastifyAutoload, {
    dir: join(__dirname, 'services'),
  })

  fastify.register(GQL, { schema, resolvers })
  next()
}
