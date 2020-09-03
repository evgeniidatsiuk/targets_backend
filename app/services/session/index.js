import jwt from 'jsonwebtoken'
import User from '../../graphql/models/user'
import { AuthenticationError } from 'apollo-server-express'
import config from '../config'

export const getUser = async (req) => {
  const token = req.headers.token
  console.log('token', token)

  if (token) {
    try {
      const { id } = await jwt.verify(token, config.jwtSecret)
      return await User.findById(id)
    } catch (e) {
      throw new AuthenticationError('You are not authenticated')
    }
  }
}
