// Product {
//   title,
//   imageUrl,
//   description,
//   price,
//   id
// }
const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

module.exports = mongoose.model('Product', productSchema)
