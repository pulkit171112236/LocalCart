// Cart: {
//   products: [
//     {
//       id,
//       qty
//     }
//   ],
//   totalPrice
// }

const SequelizeClass = require('sequelize')
const sequelize = require('../util/database')

const Product = require('./product')

const Cart = sequelize.define('cart', {
  product_id: {
    type: SequelizeClass.INTEGER,
    primaryKey: true,
  },
  qty: {
    type: SequelizeClass.INTEGER,
    allowNull: false,
  },
})

Cart.belongsTo(Product, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
})

module.exports = Cart
