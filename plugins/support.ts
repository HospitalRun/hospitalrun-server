'use strict'

import * as fp from 'fastify-plugin'


export default fp((fastify, opts, next) => {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })
  next()
})