const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
//const { syncModels } = require('./models')
require('./models')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

app.get('/', (req, res) => {
  res.status(200).end()
})

if (process.env.TESTING === 'true') {
  const testingRouter = require('./controllers/testing')
  app.use('/api', testingRouter)
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({
      error: error.errors.map(e => e.message)
    })
  }

  return response.status(400).send({ error: error.message })

}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  //await syncModels()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()