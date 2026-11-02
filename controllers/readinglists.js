const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
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