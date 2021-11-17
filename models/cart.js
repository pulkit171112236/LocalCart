// Cart: {
//   products: [
//     {
//       id,
//       qty
//     }
//   ],
//   totalPrice
// }

const db = require('../util/database_mysql')

db.execute(
  `CREATE TABLE IF NOT EXISTS cart (
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    PRIMARY KEY (product_id),
    FOREIGN KEY (product_id) REFERENCES products (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
  )
  ENGINE=InnoDB`
).catch((err) => {
  console.log('err', err)
})
module.exports = class Cart {
  static async addProduct(id) {
    return db
      .execute('SELECT * FROM cart WHERE product_id = ?', [id])
      .then(([rows]) => {
        if (rows.length === 0) {
          // add the element to cart with qty as 1
          return db.execute(
            'INSERT INTO cart (product_id, qty) VALUES (?, ?)',
            [id, 1]
          )
        } else {
          // update the existing element
          return db.execute(
            'UPDATE cart SET qty = qty+1 WHERE product_id = ?',
            [id]
          )
        }
      })
  }

  static deleteProduct(id) {
    return db.execute('DELETE FROM cart WHERE product_id = ?', [id])
  }

  static getCart() {
    return db.execute(
      'SELECT products.*, cart.qty FROM products JOIN cart ON products.id = cart.product_id'
    )
  }
}
