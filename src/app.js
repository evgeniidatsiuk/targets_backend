import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'

import schemas from './schemas'
import resolvers from './resolvers'

import models from './models'
import User from './models/user'

import path from 'path'

const server = express()

server.use(cors())

const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.config({
    path: path.join(__dirname, '../.env'),
    example: path.join(__dirname, '../.env.example')
  })
}

const getUser = async (req) => {
  const token = req.headers.token

  if (token) {
    try {
      const { id } = await jwt.verify(token, 'riddlemethis')
      return await User.findById(id)
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.')
    }
  }
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
        code: err.extensions.exception.code,
        value: err.extensions.exception.value
      }
    },
    // engine: {
    //   rewriteError(err) {
    //     return {
    //       message: err.message,
    //       code: err.extensions
    //     }
    //   }
    // },
    introspection: true,
    playground: true
  })

  app.applyMiddleware({ app: server, path: '/graphql' })

  setImmediate(() => {
    server.listen(process.env.PORT || 9000, () => {
      console.log('start')
      mongoose.connect(requireProcessEnv('MONGODB_URI'), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
    })
  })
} catch (e) {
  console.log(e)
}

export default server
