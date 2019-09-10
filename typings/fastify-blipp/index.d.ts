declare module 'fastify-blipp' {
  import { Plugin } from 'fastify'
  import http from 'http'

  let blipp: Plugin<http.Server, http.IncomingMessage, http.ServerResponse, {}>
  export default blipp
}
