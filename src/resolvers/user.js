import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthenticationError, UserInputError } from 'apollo-server'

export default {
  Query: {
    user: async (parent, { id }, { models: { User }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated')
      }
      const user = await User.findById(id)

      if (!user) {
        throw new UserInputError('Incorrect user id')
      }
      return user
    },
    me: async (parent, args, { models: { User }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated')
      }
      return me
    }
  },
  Mutation: {
    signUp: async (parent, { email, password }, { models: { User } }, info) => {
      let user = await User.findOne({ email }).lean()

      if (user) {
        throw new UserInputError('This email is already exists', {
          code: 'FOUND_USER_BY_EMAIL',
          value: email
        })
      }

      user = await User.create({ email, password })

      const token = jwt.sign({ id: user.id }, 'riddlemethis')

      return {
        token,
        user
      }
    },
    signIn: async (parent, { email, password }, { models: { User } }, info) => {
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

      const token = jwt.sign({ id: user.id }, 'riddlemethis')
      return {
        user,
        token
      }
    }
  },
  User: {
    posts: async ({ id }, args, { models: { Post } }, info) => {
      const posts = await Post.find({ author: id }).lean()
      return posts
    }
  }
}
