const SequelizeClass = require('sequelize')
const sequelize = require('../util/database')

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: SequelizeClass.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  quantity: SequelizeClass.INTEGER,
})

module.exports = OrderItem
