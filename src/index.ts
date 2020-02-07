// we need this file because of this issue: https://github.com/fastify/fastify-cli/issues/131
import 'make-promises-safe'
import { join } from 'path'
import qs from 'qs'
import Fastify from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import noIcon from 'fastify-no-icon'
import AutoLoad from 'fastify-autoload'

const port = Number(process.env.PORT) || 3000
const ip = process.env.IP || '0.0.0.0'

const fastify = Fastify({
  querystringParser: (str: string) => qs.parse(str),
  logger: true,
  ignoreTrailingSlash: true,
})
fastify.register(cors, {
  allowedHeaders: ['Content-Type', 'Authorization'],
})
fastify.register(helmet)
fastify.register(noIcon)

// This loads all application wide plugins defined in plugins folder
fastify.register(AutoLoad, {
  dir: join(__dirname, 'plugins'),
  options: {},
})

// This loads all routes and services defined in services folder
fastify.register(AutoLoad, {
  dir: join(__dirname, 'services'),
  options: {},
})

if (process.env.NODE_ENV !== 'production') {
  const blipp = require('fastify-blipp')
  fastify.register(blipp)
}

fastify.listen(port, ip, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  if (process.env.NODE_ENV !== 'production') {
    fastify.blipp()
    fastify.log.info(
      `Database username 'dev', password 'dev, GUI running on: http://localhost:5984/_utils`,
    )
  }
})
