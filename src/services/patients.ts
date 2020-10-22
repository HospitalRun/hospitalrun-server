import { Server, IncomingMessage, ServerResponse } from 'http'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import patientSchema from '../graphql/patient/patient-schema'
import patientResolvers from '../graphql/patient/patient-resolvers'

export default (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  _: FastifyPluginOptions,
  next: (error?: Error) => void,
) => {
  fastify.graphql.extendSchema(patientSchema)
  fastify.graphql.defineResolvers(patientResolvers)
  next()
}
