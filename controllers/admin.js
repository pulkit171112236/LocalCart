const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  const product = new Product(title, imageUrl, description, price)
  if (!title || !imageUrl || !price || !description) {
    return res.redirect('/admin/add-product')
  }
  product.save().then(() => {
    res.redirect('/')
  })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId).then(([rows]) => {
    if (rows.length === 1) {
      const product = rows[0]
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      })
    } else {
      res.render('/admin/products')
    }
  })
}

exports.postEditProduct = (req, res, next) => {
  // fetch all details and save
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImgUrl = req.body.imageUrl
  const updatedDesc = req.body.description
  if (!updatedTitle || !updatedPrice || !updatedImgUrl || !updatedDesc) {
    return res.redirect('/admin/edit-product/' + prodId + '?edit=true')
  }
  const updatedProduct = new Product(
    updatedTitle,
    updatedImgUrl,
    updatedDesc,
    updatedPrice,
    prodId
  )
  updatedProduct.save().then(() => {
    res.redirect('/admin/products')
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Cart.deleteProduct(productId).then(() => {
    Product.deleteById(productId).then(() => {
      res.redirect('/admin/products')
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows]) => {
    res.render('admin/products', {
      prods: rows,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  })
}
