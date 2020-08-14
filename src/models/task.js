const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
})

const Task = mongoose.model('task', taskSchema)

module.exports = Task
