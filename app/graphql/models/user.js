import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.pre('save', function() {
  const hash = bcrypt.hashSync(this.password, 9)
  this.password = hash
})

const model = mongoose.model('User', userSchema)

export default model
