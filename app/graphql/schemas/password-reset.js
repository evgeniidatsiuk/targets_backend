import { gql } from 'apollo-server'

export default gql`
  type PasswordReset {
    id: ID!
    token: String!
    user: User!
    createdAt: PasswordReset!
  }

  type PasswordResetResponse {
    passwordReset: PasswordReset!
    user: User!
  }

  extend type Query {
    getPasswordReset(token: String!): PasswordResetResponse!
  }

  extend type Mutation {
    createPasswordReset(email: String!): PasswordResetResponse!
  }
`
