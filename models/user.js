// User {
//   _id,
//   name,
//   email,
//   cart {
//     items [
//       { productId, quantity }
//     ],
//   }
// }

// Order {
//   _id,
//   userId,
//   username,
//   items [
//     {productId, quantity }
//   ]
//   totalPrice
// }

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

  getCart() {
    const db = getDb()
    const cart = this.cart
    cart.totalPrice = 0
    return db
      .collection('products')
      .find({ _id: { $in: cart.items.map((item) => item.productId) } })
      .toArray()
      .then((products) => {
        cart.items = cart.items.reduce((arr, item) => {
          const product = products.find((product) => {
            return product._id.toString() === item.productId.toString()
          }, [])
          if (product) {
            arr.push({ ...item, details: product })
            cart.totalPrice += product.price * item.quantity
          } else {
            // call async function for deleting object
            this.deleteFromCart(item.productId.toString())
          }
          return arr
        }, [])
        return cart
      })
  }

  deleteFromCart(productId) {
    const db = getDb()
    const updatedCart = { ...this.cart }
    updatedCart.items = updatedCart.items.filter(
      (item) => item.productId.toString() !== productId
    )
    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
  }

  addOrder() {
    const db = getDb()
    return this.getCart().then((cart) => {
      return db
        .collection('orders')
        .insertOne({
          items: cart.items,
          totalPrice: cart.totalPrice,
          userId: this._id,
          username: this.name,
        })
        .then(() => {
          const updatedCart = { items: [] }
          return db
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
        })
    })
  }

  getOrders() {
    const db = getDb()
    return db.collection('orders').find({ userId: this._id }).toArray()
  }

  deleteOrder(orderId) {
    const db = getDb()
    return db.collection('orders').deleteOne({ _id: ObjectId(orderId) })
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
