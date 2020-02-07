import { FastifyInstance, FastifyError } from 'fastify'
import fp from 'fastify-plugin'
import nano, { ServerScope, Configuration } from 'nano'
import proxy from './proxy'

const COUCHDB_URL = String(process.env.COUCHDB_URL)

function couchDB(
  fastify: FastifyInstance,
  options: Configuration,
  next: (err?: FastifyError | undefined) => void,
) {
  const couch = nano(options)
  fastify.decorate('couch', couch)
  fastify.register(proxy, { url: COUCHDB_URL })
  next()
}

couchDB.autoConfig = {
  url: COUCHDB_URL,
}

export = fp(couchDB)

declare module 'fastify' {
  interface FastifyInstance {
    couch: ServerScope
  }
}
