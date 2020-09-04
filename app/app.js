import cors from 'cors'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import schemas from './graphql/schemas'
import resolvers from './graphql/resolvers'

import models from './graphql/models'
import config from '../app/services/config'
import mongoose from '../app/services/mongoose'

import { getUser } from './services/session'

const server = express()

server.use(cors())

if (config.mongo.uri) {
  mongoose.connect(config.mongo.uri)
}

try {
  const app = new ApolloServer({
    typeDefs: schemas,
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
      return {
        message: err.message,
        code: err.extensions?.exception.code || err.extensions?.code,
        value: err.extensions?.exception.value || null
      }
    },
    introspection: true,
    playground: true
  })

  app.applyMiddleware({ app: server, path: '/graphql' })

  setImmediate(() => {
    server.listen(process.env.PORT || 9000, () =>
      console.log('TARGETS BACKEND')
    )
  })
} catch (e) {
  console.log(e)
}

export default server
