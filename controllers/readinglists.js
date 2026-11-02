const router = require('express').Router()
const { ReadingList } = require('../models')

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

module.exports = router