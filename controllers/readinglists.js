const router = require('express').Router()
const { ReadingList, Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  if (!blogId || !userId) {
    return res.status(400).json({ error: 'blogId or userId missing' })
  }

  const blog = await Blog.findByPk(blogId)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  const user = await User.findByPk(userId)
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  const existing = await ReadingList.findOne({ where: { blogId, userId } })
  if (existing) {
    return res.status(400).json({ error: 'blog already in reading list' })
  }
  try {
    const readingList = await ReadingList.create({
      userId: req.body.userId,
      blogId: req.body.blogId
    })
    res.json(readingList) 
  } catch (error) {
    res.status(400).json({ error: 'invalid userId/blogId' })
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)
    if (!readingList) {
      return res.status(404).json({ error: 'no such reading list' })
    }
    if (readingList.userId !== req.decodedToken.id) {
      return res.status(401).json({ error: 'The user can only mark the blogs in their own reading list as read' })
    }
    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router