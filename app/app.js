import { ApolloServer } from 'apollo-server'

import typeDefs from './graphql/schemas'
import resolvers from './graphql/resolvers'

import models from './graphql/models'
import config from '../app/services/config'
import mongoose from '../app/services/mongoose'

import { getUser } from './services/session'

try {
  bootstrap()
} catch (e) {
  console.error(e)
}

async function bootstrap() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.token
      const me = await getUser(token)

      return {
        me,
        models
      }
    },
    formatError: (err) => {
      console.error('formatError', err)

      const code = err.extensions.code

      switch (code) {
        case 'INTERNAL_SERVER_ERROR':
          return {
            message: err.message,
            code,
            value: null
          }

        case 'UNAUTHENTICATED':
          return {
            message: err.message,
            code,
            value: null
          }
        default:
          return {
            message: err.message,
            code: err.extensions?.exception.code || err.extensions.code,
            value: err.extensions?.exception.value || null
          }
      }
    },
    introspection: true,
    playground: true
  })

  const { url } = await server.listen()
  console.log(`🚀 Server ready at ${url}`)

  await mongoose.connect(config.mongo.uri)
}
