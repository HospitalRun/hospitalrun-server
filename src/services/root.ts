import { Server, IncomingMessage, ServerResponse } from 'http'
import { FastifyInstance } from 'fastify'
import { nextCallback } from 'fastify-plugin'

export default (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: {},
  next: nextCallback,
) => {
  fastify.get('/', (request, reply) => {
    reply.send({ root: true })
  })
  next()
}
