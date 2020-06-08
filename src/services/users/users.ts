import { Server, IncomingMessage, ServerResponse } from 'http'
import { FastifyInstance } from 'fastify'
import { nextCallback } from 'fastify-plugin'
import newUserRequest from '../../schemas/users/new-user-request'

export default (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  _: {},
  next: nextCallback,
) => {
  fastify.post('/', { schema: newUserRequest }, (request, reply) => {
    console.log(request.body)
    reply.send({ root: true })
  })
  next()
}
