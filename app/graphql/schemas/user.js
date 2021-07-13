import { gql } from 'apollo-server'

export default gql`
  type Posts {
    edges: [Post]!
    totalCount: Int!
  }

  type User {
    id: ID!
    email: String!
    posts(
      first: Int
      last: Int
      after: ID
      page: Int
      limit: Int
      q: String
    ): Posts
  }

  type Auth {
    user: User!
    token: String!
  }

  type Query {
    user(id: ID!): User!
    me: User!
  }

  type Mutation {
    signUp(email: String!, password: String!): Auth!
    signIn(email: String!, password: String!): Auth!
  }
`
