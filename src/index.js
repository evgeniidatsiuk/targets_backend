import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import schemas from './schemas';
import resolvers from './resolvers';

import User from './models/user';
import Post from './models/post';

const app = express();
app.use(cors());

const getUser = async (req) => {
    const token = req.headers['token'];

    if (token) {
        try {
            return await jwt.verify(token, 'riddlemethis');
        } catch (e) {
            throw new AuthenticationError('Your session expired. Sign in again.');
        }
    }
};

const server = new ApolloServer({
    typeDefs: schemas,
    resolvers,
    context: async ({ req }) => {
        if (req) {

            const { id } = await getUser(req);
            const me = await User.findById(id)
            return {
                me,
                models: {
                    User,
                    Post
                },
            };
        }
    },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(9000, () => {
    mongoose.connect('mongodb://localhost:27017/graphql', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
});
