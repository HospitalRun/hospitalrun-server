// we need this file because of this issue: https://github.com/fastify/fastify-cli/issues/131
import 'make-promises-safe'
import blipp from 'fastify-blipp'

import Fastify from 'fastify'

import app from './app'

console.time('Boot Time')
const fastify = Fastify(app.options)

fastify.register(blipp)
fastify.register(app)

fastify.listen((process.env.PORT as any) || 3000, '0.0.0.0', err => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  fastify.blipp()

  console.timeEnd('Boot Time')
  console.log(`Server listening on port ${(fastify.server as any).address().port}`)
})
