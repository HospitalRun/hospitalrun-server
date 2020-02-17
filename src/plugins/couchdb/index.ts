import { FastifyInstance, FastifyError } from 'fastify'
import fp from 'fastify-plugin'
import nano, { ServerScope, Configuration } from 'nano'
import proxy from './proxy'

const COUCHDB_URL = process.env.COUCHDB_URL ? String(process.env.COUCHDB_URL) : undefined

function couchDB(
  fastify: FastifyInstance,
  options: Configuration,
  next: (err?: FastifyError | undefined) => void,
) {
  const url = COUCHDB_URL || options.url
  const couch = nano({ ...options, url })
  fastify.decorate('couch', couch)
  fastify.register(proxy, { url })
  next()
}

couchDB.autoConfig = {
  url: COUCHDB_URL,
}

export default fp(couchDB)

declare module 'fastify' {
  interface FastifyInstance {
    couch: ServerScope
  }
}
