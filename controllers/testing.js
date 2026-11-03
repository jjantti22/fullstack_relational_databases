const router = require('express').Router()
const { Blog, User, ReadingList, TokenSession } = require('../models')

router.post('/reset', async (req, res) => {
  await ReadingList.destroy({ where: {} })
  await TokenSession.destroy({ where: {} })
  await Blog.destroy({ where: {} })
  await User.destroy({ where: {} })
  res.status(204).end()
})

module.exports = router