import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import schemas from './schemas';
import resolvers from './resolvers';

import User from './models/user';
import Post from './models/post';

import path from 'path';

const server = express();

server.use(cors());

const requireProcessEnv = (name) => {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable')
    }
    return process.env[name]
}

if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv-safe')
    dotenv.config({
        path: path.join(__dirname, '../.env'),
        example: path.join(__dirname, '../.env.example')
    })
}


const getUser = async (req) => {
    const token = req.headers['token'];

    if (token) {
        try {
            const { id } = await jwt.verify(token, 'riddlemethis');
            return await User.findById(id);
        } catch (e) {
            throw new AuthenticationError('Your session expired. Sign in again.');
        }
    }
};

const app = new ApolloServer({
    typeDefs: schemas,
    resolvers,
    context: async ({ req }) => {
        if (req) {

            const me = await getUser(req);
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

app.applyMiddleware({ app: server, path: '/graphql' });


server.listen(process.env.PORT || 9000, () => {
    mongoose.connect(requireProcessEnv('MONGODB_URI'), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
});


export default server
