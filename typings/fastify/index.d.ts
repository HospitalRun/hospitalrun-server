import 'fastify'
declare module 'fastify' {
  interface FastifyInstance {
    blipp(): unknown
  }
}
