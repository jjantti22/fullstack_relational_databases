const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

//const syncModels = async () => {
//  await User.sync({ alter: true })
//  await Blog.sync({ alter: true })
//}

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readingListUsers' })

module.exports = {
  Blog, 
  User,
  ReadingList
}