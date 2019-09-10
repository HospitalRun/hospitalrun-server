'use strict'
import * as fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'


export default (fastify: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>, opts, next) => {
  fastify.get('/', (request, reply) => {
    reply.send({ root: true })
  })
  next()
}