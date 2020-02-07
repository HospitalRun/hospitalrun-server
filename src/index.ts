// we need this file because of this issue: https://github.com/fastify/fastify-cli/issues/131
import 'make-promises-safe'
import Fastify from 'fastify'
import hospitalRun from './app'

const port = Number(process.env.PORT) || 3000
const ip = process.env.IP || '0.0.0.0'

const fastify = Fastify(hospitalRun.options)
fastify.register(hospitalRun)

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
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
