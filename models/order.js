const SequelizeClass = require('sequelize')
const sequelize = require('../util/database')

const Order = sequelize.define('order', {
  id: {
    type: SequelizeClass.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
})

module.exports = Order
