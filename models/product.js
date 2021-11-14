const fs = require('fs')
const path = require('path')
const rootDir = path.dirname(require.main.filename)

const products = []

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
)
const getProductsFromFile = (callBack) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      callBack([])
    } else {
      callBack(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }
  save() {
    this.id = Math.random.toString()
    getProductsFromFile((products) => {
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) console.log('write-err:', err)
      })
    })
  }
  static fetchAll(callBack) {
    getProductsFromFile((products) => {
      callBack(products)
    })
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id)
      cb(product)
    })
  }
}
