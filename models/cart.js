// Cart: {
//   products: [
//     {
//       id,
//       qty
//     }
//   ],
//   totalPrice
// }

const fs = require('fs')
const path = require('path')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      )
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty = updatedProduct.qty + 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id: id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err)
      })
    })
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        // cart is empty
        return
      } else {
        const updatedCart = { ...JSON.parse(fileContent) }
        const existingProduct = updatedCart.products.find(
          (cprod) => cprod.id === id
        )
        if (existingProduct) {
          // decreasing price
          const prdQty = existingProduct.qty
          updatedCart.totalPrice = updatedCart.totalPrice - prdQty * price
          // removing product from cart
          updatedCart.products = updatedCart.products.filter(
            (prod) => prod.id !== id
          )
          fs.writeFile(p, JSON.stringify(updatedCart), (err) => {})
        }
      }
    })
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cb(JSON.parse(fileContent))
      } else {
        console.log('err-when-reading-from-cart:', err)
        cb({ products: [], totalPrice: 0 })
      }
    })
  }
}
