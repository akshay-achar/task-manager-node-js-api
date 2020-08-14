const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate (value) {
      if (value.includes('password')) {
        throw new Error('Password text should not be added')
      }
    }
  },
  age: {
    type: Number,
    default: 60,
    validate (value) {
      if (value <= 0) {
        throw new Error('Age must be positive')
      }
    }
  },
  tokens: [{
    token: {
      type: String
    }
  }]
}, {
  timestamps: true
})

userSchema.statics.findByCredentails = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Unable to Login!')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to Login!')
  }
  return user
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

// userSchema.methods.toJSON = function () {
//   const user = this
//   const userObject = user.toObject()
//   delete userObject.password
//   delete userObject.tokens
//   return userObject
// }

const User = mongoose.model('user', userSchema)

module.exports = User
