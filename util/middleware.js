const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { TokenSession, User } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)

      const session = await TokenSession.findOne({ where: { token } })
      if (!session) {
        return res.status(401).json({ error: 'token expired or invalid' })
      }

      const user = await User.findByPk(req.decodedToken.id)
      if (user.disabled) {
        return res.status(401).json({ error: 'account access revodek' })
      }
      req.token = token 
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }