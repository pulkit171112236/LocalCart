// Product {
//   title,
//   imageUrl,
//   description,
//   price,
//   id
// }
const mongodb = require('mongodb')
const { getDb } = require('../util/database')
class Product {
  constructor(title, price, imageUrl, description, prodId = null) {
    this.title = title
    this.price = price
    this.imageUrl = imageUrl
    this.description = description
    this._id = prodId ? new mongodb.ObjectId(prodId) : null
  }

  save() {
    console.log('id: ', this._id)
    const db = getDb()
    if (this._id) {
      return db
        .collection('products')
        .updateOne(
          { _id: this._id },
          {
            $set: this,
            // {
            //   title: this.title,
            //   price: this.price,
            //   imageUrl: this.imageUrl,
            //   description: this.description,
            // },
          }
        )
        .catch((err) => {
          console.log('__err_updating__', err)
        })
    } else {
      return db
        .collection('products')
        .insertOne(this)
        .catch((err) => {
          console.log('__error_adding_new_product__', err)
        })
    }
  }

  static deleteById(prodId) {
    const db = getDb()
    return db
      .collection('products')
      .deleteOne({ _id: mongodb.ObjectId(prodId) })
      .catch((err) => {
        console.log('__error_deleting_product__')
      })
  }

  static fetchAll() {
    const db = getDb()
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        return products
      })
      .catch((err) => {
        console.log('__error_fetching__', err)
      })
  }

  static findById(prodId) {
    const db = getDb()
    console.log()
    return db
      .collection('products')
      .find({ _id: mongodb.ObjectId(prodId) })
      .toArray()
      .then((products) => {
        if (products.length > 0) {
          return products[0]
        } else throw 'no_product_found'
      })
  }
}

module.exports = Product
