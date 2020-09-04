import { UserInputError } from 'apollo-server'
import { emailRegex } from '../../services/constants'

export const validateEmail = (email) => {
  if (!email) {
    throw new UserInputError('Email cannot be empty', {
      code: 'EMAIL_CANNOT_BE_EMPTY',
      value: email
    })
  }

  if (!email.match(emailRegex)) {
    throw new UserInputError('Invalid email', {
      code: 'INVALID_EMAIL',
      value: email
    })
  }
}
