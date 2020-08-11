import { gql } from 'apollo-server';

export default gql`
    type User {
        id: ID!
        email: String!
        posts: [Post!]!
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
        createUser(email: String!, password: String!): Auth!
        login(email: String!, password: String!): Auth!
    }
`;
