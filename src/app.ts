import { join } from 'path'
import AutoLoad from 'fastify-autoload'
import { FastifyInstance } from 'fastify'
import { nextCallback } from 'fastify-plugin'
import noIcon from 'fastify-no-icon'
import helmet from 'fastify-helmet'
import qs from 'qs'
import cors from 'fastify-cors'

function App(fastify: FastifyInstance, opts: {}, next: nextCallback) {
  fastify.register(cors, {
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
  fastify.register(helmet)
  fastify.register(noIcon)

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

App.options = {
  querystringParser: (str: string) => qs.parse(str),
  logger: true,
  ignoreTrailingSlash: true,
}

export = App
