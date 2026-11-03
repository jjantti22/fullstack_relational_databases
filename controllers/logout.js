const router = require('express').Router()
const { TokenSession } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  await TokenSession.destroy({
    where: {
      token: req.token
    }
  })
  res.status(204).end()
})

module.exports = router