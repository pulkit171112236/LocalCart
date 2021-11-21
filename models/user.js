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

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = require('../models/product')
const Order = require('../models/order')

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
})

userSchema.methods.addToCart = function (prodId) {
  const updatedCart = { ...this.cart }
  const cartItemIndex = this.cart.items.findIndex((item) => {
    return item.productId.toString() === prodId
  })
  if (cartItemIndex >= 0) {
    // item already exists
    updatedCart.items[cartItemIndex].quantity += 1
  } else {
    // increase the quantity
    updatedCart.items.push({ productId: prodId, quantity: 1 })
  }
  this.cart = updatedCart
  return this.save()
}

userSchema.methods.getCart = function () {
  return this.populate('cart.items.productId')
    .then((user) => {
      const cart = { totalPrice: 0 }
      cart.items = user.cart.items.reduce((arr, item, i) => {
        if (item.productId) {
          cart.totalPrice += item.productId.price * item.quantity
          arr.push({
            details: { ...item.productId._doc },
            quantity: item.quantity,
            productId: item._id,
          })
        } else {
          // delete the item from cart temporarily
          this.cart.items.splice(i, 1)
        }
        return arr
      }, [])
      //save user deleting unmapped cart items
      return this.save().then(() => cart)
    })
    .catch((err) => {
      console.log('err:', err)
    })
}

userSchema.methods.deleteFromCart = function (productId) {
  this.cart.items = this.cart.items.filter(
    (item) => item._id.toString() !== productId
  )
  return this.save()
}

userSchema.methods.addOrder = function () {
  return this.getCart()
    .then((cart) => {
      const order = new Order({
        items: cart.items,
        totalPrice: cart.totalPrice,
        userId: this._id,
        username: this.name,
      })
      return order.save()
    })
    .then(() => {
      this.cart = { items: [] }
      return this.save()
    })
}

module.exports = mongoose.model('User', userSchema)
