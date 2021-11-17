// Product {
//   title,
//   imageUrl,
//   description,
//   price,
//   id
// }

const SequelizeClass = require('sequelize')

const sequelize = require('../util/database')

const Product = sequelize.define('product', {
  id: {
    type: SequelizeClass.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  title: {
    type: SequelizeClass.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: SequelizeClass.TEXT,
    allowNull: false,
  },
  description: {
    type: SequelizeClass.TEXT,
    allowNull: false,
  },
  price: {
    type: SequelizeClass.DOUBLE,
    allowNull: false,
  },
})

module.exports = Product
