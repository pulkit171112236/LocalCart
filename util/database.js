const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('node-complete', 'root', 'asphalt8', {
  dialect: 'mysql',
  host: 'localhost',
})

module.exports = sequelize
