const { ObjectId } = require('mongodb')
const { getDb } = require('../util/database')
const Product = require('./product')
class User {
  constructor(name, email, cart = null, userId = null) {
    this.name = name
    this.email = email
    this.cart = cart || { items: [] }
    this._id = userId ? ObjectId(userId) : null
  }
  save() {
    const db = getDb()
    return db
      .collection('users')
      .insertOne(this)
      .catch((err) => {
        console.log('__err_creating_user__', err)
      })
  }

  addToCart(prodId) {
    const db = getDb()
    const updatedCart = { ...this.cart }
    const cartItemIndex = this.cart.items.findIndex((item) => {
      return item.productId.toString() === prodId
    })
    if (cartItemIndex >= 0) {
      // item already exists
      updatedCart.items[cartItemIndex].quantity += 1
    } else {
      // increase the quantity
      updatedCart.items.push({ productId: ObjectId(prodId), quantity: 1 })
    }
    return db.collection('users').updateOne(
      { _id: this._id },
      {
        $set: {
          cart: updatedCart,
        },
      }
    )
  }

  static getById(userId) {
    const db = getDb()
    return db
      .collection('users')
      .findOne({ _id: ObjectId(userId) })
      .then((user) => {
        return user
      })
      .catch((err) => {
        console.log('__error_getting_user__', err)
      })
  }
}

module.exports = User
