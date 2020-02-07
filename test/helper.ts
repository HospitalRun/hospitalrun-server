import Fastify from 'fastify'
import fp from 'fastify-plugin'
import App from '../src/app'

// Fill in this config with all the configurations
// needed for testing the application
export const config = () => ({
  url: 'http://localhost:5984',
})

// automatically build and tear down our instance
export const build = (t: any) => {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.tearDown(app.close.bind(app))

  return app
}

export default {
  config,
  build,
}
