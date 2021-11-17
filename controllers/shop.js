const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    })
  })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findByPk(prodId).then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: 'Details',
      path: '/products',
    })
  })
}

exports.getCart = (req, res, next) => {
  Cart.getCart().then(([rows]) => {
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      products: rows,
      totalPrice: 0,
    })
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Cart.addProduct(prodId).then((result) => {
    console.log('result', result)
    res.redirect('/cart')
  })
}

exports.postDeleteFromCart = (req, res, next) => {
  const productId = req.body.productId
  Cart.deleteProduct(productId).then(() => {
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  })
}
