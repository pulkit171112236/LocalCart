// Product {
//   title,
//   imageUrl,
//   description,
//   price,
//   id
// }

const db = require('../util/database')

module.exports = class Product {
  constructor(title, imageUrl, description, price, id = null) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
    this.id = id
  }

  save() {
    // product already exists
    if (this.id) {
      return db.execute(
        'UPDATE products SET title=?, price=?, description=?, imageUrl=? WHERE id = ?',
        [this.title, this.price, this.description, this.imageUrl, this.id]
      )
    }
    // create a new product
    else {
      return db.execute(
        'INSERT INTO products(price, description, imageUrl, title) VALUES (?, ?, ?, ?)',
        [this.price, this.description, this.imageUrl, this.title]
      )
    }
  }

  static deleteById(productId) {
    return db.execute('DELETE FROM products WHERE id = ?', [productId])
  }

  static fetchAll(cb) {
    return db.execute('SELECT * FROM products')
  }

  // **need to be updated
  static findById(id) {
    return db.execute('SELECT * FROM products where id = ?', [id])
  }
}
