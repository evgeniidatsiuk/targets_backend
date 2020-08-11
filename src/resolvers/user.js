import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export default {
    Query: {
        user: async (parent, { id }, { models: { User }, me }, info) => {
            if (!me) {
                throw new AuthenticationError('You are not authenticated');
            }
            const user = await User.findById(id).lean();
            return user;
        },
        me: async (parent, args, { models: { User }, me }, info) => {
            if (!me) {
                throw new AuthenticationError('You are not authenticated');
            }
            return me;
        },
    },
    Mutation: {
        createUser: async (parent, { email, password }, { models: { User } }, info) => {
            const user = await User.create({ email, password });
            const token = jwt.sign({ id: user.id }, 'riddlemethis');

            return {
                token,
                user
            };
        },
        login: async (parent, { email, password }, { models: { User } }, info) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Invalid credentials');
            }

            const matchPasswords = bcrypt.compareSync(password, user.password);

            if (!matchPasswords) {
                throw new AuthenticationError('Invalid credentials');
            }

            const token = jwt.sign({ id: user.id }, 'riddlemethis');
            return {
                user,
                token
            }
        }
    },
    User: {
        posts: async ({ id }, args, { models: { Post } }, info) => {
            const posts = await Post.find({ author: id }).lean();
            return posts;
        },
    },
};
