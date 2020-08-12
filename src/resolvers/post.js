import { AuthenticationError } from 'apollo-server';

export default {
    Query: {
        post: async (parent, { id }, { models: { Post }, me }, info) => {
            if (!me) {
                throw new AuthenticationError('You are not authenticated');
            }

            const post = await Post.findById(id).lean();

            return post;
        },
        posts: async (parent, args, { models: { Post }, me }, info) => {
            if (!me) {
                throw new AuthenticationError('You are not authenticated');
            }

            const posts = await Post.find({ author: me.id }).lean();

            return posts;
        },
    },
    Mutation: {
        createPost: async (parent, { title, content }, { models: { Post }, me }, info) => {
            if (!me) {
                throw new AuthenticationError('You are not authenticated');
            }

            const post = await Post.create({ title, content, author: me.id });

            return post;
        },
    },
    Post: {
        author: async ({ author }, args, { models: { User } }, info) => {
            const user = await User.findById(author).lean();

            return user;
        },
    },
};
