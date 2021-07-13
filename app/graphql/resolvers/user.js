import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthenticationError, UserInputError } from 'apollo-server'
import config from '../../services/config'
import { validateEmail } from '../helpers/app'

export default {
  Query: {
    user: async (parent, { id }, { models: { User }, me }) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated')
      }
      const user = await User.findById(id)

      if (!user) {
        throw new UserInputError('User not found', {
          code: 'NOT_FOUND_USER_BY_ID',
          value: id
        })
      }

      return user
    },
    me: async (parent, args, { me }) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated')
      }
      return me
    }
  },
  Mutation: {
    signUp: async (parent, { email, password }, { models: { User } }) => {
      validateEmail(email)
      let user = await User.findOne({ email }).lean()

      if (user) {
        throw new UserInputError('This email is already exists', {
          code: 'FOUND_USER_BY_EMAIL',
          value: email
        })
      }

      user = await User.create({ email, password })

      const token = jwt.sign({ id: user.id }, config.jwtSecret)

      return {
        token,
        user
      }
    },
    signIn: async (parent, { email, password }, { models: { User } }) => {
      validateEmail(email)
      const user = await User.findOne({ email })

      if (!user) {
        throw new UserInputError('User not found', {
          code: 'NOT_FOUND_USER_BY_EMAIL',
          value: email
        })
      }

      const matchPasswords = bcrypt.compareSync(password, user.password)

      if (!matchPasswords) {
        throw new UserInputError('Password is incorrect', {
          code: 'INVALID_PASSWORD',
          value: password
        })
      }

      const token = jwt.sign({ id: user.id }, config.jwtSecret)
      return {
        user,
        token
      }
    }
  },
  User: {
    posts: async (parent, args, { models: { Post } }) => {
      const { id } = parent
      const { first, last } = args

      const query = {}
      const cursor = {}

      if (id) query.author = id

      if (first) {
        cursor.limit = first
        cursor.sort = { _id: 1 }
      }

      if (last) {
        cursor.limit = last
        cursor.sort = { _id: -1 }
      }

      const edges = await Post.find(query, {}, cursor).lean()
      const totalCount = await Post.countDocuments(query)

      return {
        edges,
        totalCount
      }
    }
  }
}
