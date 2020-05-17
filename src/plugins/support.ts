import fp from 'fastify-plugin'

export default fp((fastify, _, next) => {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })
  next()
})

declare module 'fastify' {
  interface FastifyInstance {
    someSupport(): string
  }
}
