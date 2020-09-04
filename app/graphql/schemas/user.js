import { gql } from 'apollo-server'

export default gql`
  type Posts {
    rows: [Post]!
    count: Int!
  }

  type User {
    id: ID!
    email: String!
    posts(page: Int!, limit: Int!, q: String): Posts
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
