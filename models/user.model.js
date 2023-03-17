const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const __DATABASE_PASSWORD_MIN_SIZE = 4
const __DATABASE_PASSWORD_MAX_SIZE = 72

const userSchema = mongoose.Schema({
  // User's pseudonym
  pseudonym: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 55,
    unique: true,
    trim: true,
  },

  // User's e-mail
  email: {
    type: String,
    required: true,
    validate: [isEmail],
    unique: true,
    trim: true,
  },

  // User's password
  password: {
    type: String,
    required: true,
    minLength: __DATABASE_PASSWORD_MIN_SIZE,
    maxLength: __DATABASE_PASSWORD_MAX_SIZE,
  },

  // User's misc informations
  infos: {
    avatar: { type: String },
    bio: { type: String, maxLength: 2048 },
    hobbies: {
      description: { type: String },
      topPosition: { type: Number },
    },
  },
  // Projects followed by the user
  followedProjects: {
    type: Array,
  },
})

// Crypting the user's password (MANDATORY !!!!!)
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Handling the user's connection.
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    // Bcrypt vérifie que le hash enregistré ET le hash envoyé ont été produits par la même chaîne de caractères.
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('incorrect password')
  }
  throw Error('incorrect email')
}

// The model is compiled by Mongoose, and the user is added into the database.
const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
