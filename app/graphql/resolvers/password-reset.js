import { UserInputError } from 'apollo-server'
import { validateEmail } from '../helpers/app'

export default {
  Query: {
    getPasswordReset: async (
      parent,
      { token },
      { models: { PasswordReset } }
    ) => {
      const reset = await PasswordReset.findOne({ token }).lean()

      if (!reset) {
        throw new Error("Token has expired or doesn't exist")
      }

      return reset
    }
  },
  Mutation: {
    createPasswordReset: async (
      parent,
      { email },
      { models: { User, PasswordReset } }
    ) => {
      validateEmail(email)
      const user = await User.findOne({ email })

      if (!user) {
        throw new UserInputError('User not found', {
          code: 'NOT_FOUND_USER_BY_EMAIL',
          value: email
        })
      }

      const passwordReset = await PasswordReset.create({ user: user.id })

      return {
        user,
        passwordReset
      }
    }
  },
  PasswordReset: {
    user: async ({ user }, args, { models: { User } }) => {
      return !!(await User.findById(user).lean())
    }
  }
}
