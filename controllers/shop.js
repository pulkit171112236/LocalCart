const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  console.log(Product.fetchAll)
  const products = Product.fetchAll((products) => {
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      path: '/products',
      prods: products,
    })
  })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  console.log('product-id:', prodId)
  Product.findById(prodId, (product) => {
    console.log('fetched-product:', product)
    res.render('shop/product-detail', {
      pageTitle: 'Product',
      path: '/products',
      product,
    })
  })
}

exports.getIndex = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      prods: products,
    })
  })
}

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
  })
}

exports.postCart = (req, res, next) => {
  res.redirect('/cart')
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  })
}
