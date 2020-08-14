const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.get('/task', auth, async (req, res) => {
  try {
    const task = await Task.find({ owner: req.user._id })
    res.send({ task })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/task/:id', auth, async (req, res) => {
  try {
    const task = await Task.find({ _id: req.params.id, owner: req.user._id })
    res.send({ task })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/task', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    })
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/task/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowUpdates = ['name', 'description']
  const isValidOperation = updates.every((update) => {
    return allowUpdates.includes(update)
  })

  if (!isValidOperation) {
    return res.status(404).send({ error: 'Invalid Updates' })
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    updates.forEach((update) => {
      task[update] = req.body[update]
    })
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/task/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

module.exports = router
