import path from 'path'

export const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.config({
    path: path.join(__dirname, '../../../.env'),
    example: path.join(__dirname, '../../../.env.example')
  })
}

export default {
  jwtSecret: requireProcessEnv('JWT_SECRET'),
  mongo: {
    uri: requireProcessEnv('MONGODB_URI'),
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      debug: true
    }
  }
}
