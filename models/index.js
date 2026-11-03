const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const TokenSession = require('./tokenSession')

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasMany(TokenSession)
TokenSession.belongsTo(User)
//const syncModels = async () => {
//  await User.sync({ alter: true })
//  await Blog.sync({ alter: true })
//}

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readingListUsers' })

module.exports = {
  Blog, 
  User,
  ReadingList,
  TokenSession
}