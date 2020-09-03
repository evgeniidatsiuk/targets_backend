import mongoose, { Schema } from 'mongoose'
import { uid } from 'rand-token'

const passwordResetSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  token: {
    type: String,
    unique: true,
    index: true,
    default: () => uid(32)
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600
  }
})

const model = mongoose.model('PasswordReset', passwordResetSchema)
export default model
