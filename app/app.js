import { ApolloServer } from 'apollo-server'

import typeDefs from './graphql/schemas'
import resolvers from './graphql/resolvers'

import models from './graphql/models'
import config from '../app/services/config'
import mongoose from '../app/services/mongoose'

import { getUser } from './services/session'

if (config.mongo.uri) {
  mongoose.connect(config.mongo.uri)
}

try {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      if (req) {
        const me = await getUser(req)
        return {
          me,
          models
        }
      }
    },
    formatError: (err) => {
      console.log('err', err)
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

  setImmediate(() => {
    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`)
    })
  })
} catch (e) {
  console.log(e)
}
