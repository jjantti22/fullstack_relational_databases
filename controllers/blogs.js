const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: { [Op.iLike]: `%${req.query.search}%` }
      },
      {
        author: { [Op.iLike]: `%${req.query.search}%` }
      }
    ]

  }
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name', 'username']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy()
    res.status(204).end()
  } else {
    res.status(401).json({ error: 'userId does not match token' })
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router