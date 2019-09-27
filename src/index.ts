// we need this file because of this issue: https://github.com/fastify/fastify-cli/issues/131
import 'make-promises-safe'

import Fastify from 'fastify'
import cors from 'fastify-cors'
import noIcon from 'fastify-no-icon'
import helmet from 'fastify-helmet'
import qs from 'qs'

import app from './app'

console.time('Boot Time')
const fastify = Fastify({
  querystringParser: str => qs.parse(str),
  logger: true,
  ignoreTrailingSlash: true,
})

fastify.register(cors, {
  allowedHeaders: ['Content-Type', 'Authorization'],
})

if (process.env.NODE_ENV !== 'production') {
  const blipp = require('fastify-blipp') // eslint-disable-line
  fastify.register(blipp)
}

fastify.register(helmet)

fastify.register(noIcon)
fastify.register(app)

fastify.listen((process.env.PORT as any) || 3000, '0.0.0.0', err => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  if (process.env.NODE_ENV !== 'production') {
    fastify.blipp()
  }
  console.timeEnd('Boot Time')
  console.log(`Server listening on port ${(fastify.server as any).address().port}`)
})
