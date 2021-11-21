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

module.exports = mongoose.model('User', userSchema)
