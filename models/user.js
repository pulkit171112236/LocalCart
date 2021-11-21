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

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = require('../models/product')

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
          cart.totalPrice += item.productId.price
          arr.push({
            details: item.productId,
            quantity: item.quantity,
            productId: item._id,
          })
        } else {
          // delete the item from cart temporarily
          user.cart.items.splice(i, 1)
        }
        return arr
      }, [])
      // asynchronously save user deleting unmapped cart items
      user.save()
      return cart
    })
    .catch((err) => {
      console.log('err:', err)
    })
}

module.exports = mongoose.model('User', userSchema)
