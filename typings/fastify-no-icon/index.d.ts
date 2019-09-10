declare module 'fastify-no-icon' {
  import { Plugin } from 'fastify'
  import http from 'http'

  let noIcon: Plugin<http.Server, http.IncomingMessage, http.ServerResponse, {}>
  export default noIcon
}
