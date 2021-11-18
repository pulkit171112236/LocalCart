const SequelizeClass = require('sequelize')

const sequelize = require('../util/database')

const User = sequelize.define('user', {
  id: {
    type: SequelizeClass.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: SequelizeClass.STRING,
  email: SequelizeClass.STRING,
})

module.exports = User
