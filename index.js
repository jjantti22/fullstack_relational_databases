const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const { syncModels } = require('./models')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  return response.status(400).send({ error: error.message })

}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  await syncModels()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()