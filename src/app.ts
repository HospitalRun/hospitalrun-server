import { Server, IncomingMessage, ServerResponse } from 'http'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fastifyAutoload from 'fastify-autoload'
import { join } from 'path'
import mercurius from 'mercurius'

export default (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  _: FastifyPluginOptions,
  next: (error?: Error) => void,
) => {
  // fastify.register(fastifyHelmet)
  fastify.register(mercurius, {
    defineMutation: true,
  } as any)
  fastify.register(fastifyAutoload, {
    dir: join(__dirname, 'services'),
  })
  next()
}
