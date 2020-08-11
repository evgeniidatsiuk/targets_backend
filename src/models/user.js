import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
});

userSchema.pre('save', function() {
    const hash = bcrypt.hashSync(this.password, 16);
    this.password = hash;
});

const model = mongoose.model('User', userSchema);

export default model;
