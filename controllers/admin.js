const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  })
}

// **to be fixed later
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = Number(req.body.price)
  const description = req.body.description
  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    req.user._id.valueOf()
  )
  product.save().then(() => {
    res.redirect('/products')
  })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId).then((product) => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
    })
  })
}

exports.postEditProduct = (req, res, next) => {
  // fetch all details and save
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = Number(req.body.price)
  const updatedImgUrl = req.body.imageUrl
  const updatedDesc = req.body.description
  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedImgUrl,
    updatedDesc,
    req.user._id,
    prodId
  )
  product.save().then(() => {
    res.redirect('/admin/products')
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.deleteById(productId).then(() => {
    res.redirect('/admin/products')
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  })
}
