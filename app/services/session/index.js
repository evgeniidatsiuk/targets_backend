import jwt from 'jsonwebtoken'
import User from '../../graphql/models/user'
import { AuthenticationError } from 'apollo-server'
import config from '../config'

export const getUser = async (token) => {
  if (token) {
    try {
      const { id } = await jwt.verify(token, config.jwtSecret)

      return User.findById(id)
    } catch (e) {
      throw new AuthenticationError('You are not authenticated')
    }
  }
}
