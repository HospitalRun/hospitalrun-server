import { join } from 'path'
import AutoLoad from 'fastify-autoload'
import { FastifyInstance } from 'fastify'
import { nextCallback } from 'fastify-plugin'

export = function(fastify: FastifyInstance, opts: {}, next: nextCallback) {
  // This loads all application wide plugins defined in plugins folder
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    includeTypeScript: true,
    options: Object.assign({}, opts),
  })

  // This loads all routes and services defined in services folder
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'services'),
    includeTypeScript: true,
    options: Object.assign({}, opts),
  })

  next()
}
