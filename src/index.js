const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
require('./db/mongoose')

const port = process.env.PORT | 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/test', async (req, res) => {
  res.send('test')
})

app.listen(port, () => {
  console.log('Server running at port:' + port)
})
