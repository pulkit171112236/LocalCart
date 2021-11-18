const SequelizeClass = require('sequelize')
const sequelize = require('../util/database')

const CartItem = sequelize.define('cartItem', {
  id: {
    type: SequelizeClass.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  quantity: SequelizeClass.INTEGER,
})

module.exports = CartItem
