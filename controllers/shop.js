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
  Cart.findAll({
    include: [{ model: Product }],
  }).then((cart) => {
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      cart: cart,
      totalPrice: 0,
    })
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Cart.findByPk(prodId)
    .then((element) => {
      if (element) {
        return element.update({
          qty: element.qty + 1,
        })
      } else {
        return Cart.create({
          product_id: prodId,
          qty: 1,
        })
      }
    })
    .then(() => {
      return res.redirect('/cart')
    })
    .catch((err) => {
      console.log('__error_while_updating_cart__', err)
    })
  // Cart.addProduct(prodId).then((result) => {
  // })
}

exports.postDeleteFromCart = (req, res, next) => {
  const productId = req.body.productId
  Cart.destroy({
    where: { product_id: productId },
  })
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => {
      console.log('__error_while_deleting_from_cart__', err)
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
