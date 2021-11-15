const fs = require('fs')
const path = require('path')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
)

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([])
    } else {
      cb(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor(title, imageUrl, description, price, id = null) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
    this.id = id
  }

  save() {
    getProductsFromFile((products) => {
      const existingId = this.id
      if (existingId) {
        // update the exisiting product
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === existingId
        )
        products[existingProductIndex] = this
      } else {
        // push the newly created product
        this.id = Math.random().toString()
        products.push(this)
      }
      // write the updated products
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id)
      cb(product)
    })
  }
}
