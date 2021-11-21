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

const orderSchema = Schema({
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      details: {
        type: Object,
        required: true,
      },
      quantity: Number,
    },
  ],
  totalPrice: Number,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: String,
})

module.exports = mongoose.model('Order', orderSchema)
