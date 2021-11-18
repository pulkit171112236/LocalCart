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
  const price = req.body.price
  const description = req.body.description
  const user = req.user
  user
    .createProduct({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
      userId: user.id,
    })
    .then(() => {
      console.log('__added__')
      res.redirect('/admin/products')
    })
    .catch((err) => {
      console.log('__error_creating_product__', err)
      res.redirect('/admin/add-product')
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findByPk(prodId).then((product) => {
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
  const updatedPrice = req.body.price
  const updatedImgUrl = req.body.imageUrl
  const updatedDesc = req.body.description
  Product.upsert({
    id: prodId,
    title: updatedTitle,
    price: updatedPrice,
    imageUrl: updatedImgUrl,
    description: updatedDesc,
  })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch((err) => {
      console.log('__error_while_updating__', err)
      return res.redirect('/admin/edit-product/' + prodId + '?edit=true')
    })
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.destroy({ where: { id: productId } }).then((rowsDeleted) => {
    res.redirect('/admin/products')
  })
}

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  })
}
