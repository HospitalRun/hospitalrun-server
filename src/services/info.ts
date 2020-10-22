import { Server, IncomingMessage, ServerResponse } from 'http'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import infoSchema from '../graphql/info/info-schema'
import infoResolvers from '../graphql/info/info-resolvers'

export default (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  _: FastifyPluginOptions,
  next: (error?: Error) => void,
) => {
  fastify.graphql.extendSchema(infoSchema)
  fastify.graphql.defineResolvers(infoResolvers)
  next()
}
