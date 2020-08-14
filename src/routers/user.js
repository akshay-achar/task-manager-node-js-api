const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentails(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ token })
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/users', async (req, res) => {
  try {
    const user = await new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.send({ user })
  } catch (e) {
    res.status(500).send(e)
  }
})

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => {
    return allowUpdates.includes(update)
  })

  if (!isValidOperation) {
    return res.status(404).send({ error: 'Invalid Updates' })
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update]
    })
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
