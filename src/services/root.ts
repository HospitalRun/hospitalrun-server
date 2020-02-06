import { Server, IncomingMessage, ServerResponse } from 'http'
import { FastifyInstance } from 'fastify'
import { nextCallback } from 'fastify-plugin'

export default (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  _: {},
  next: nextCallback,
) => {
  fastify.get('/', (_, reply) => {
    reply.send({ root: true })
  })
  next()
}
