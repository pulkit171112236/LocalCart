const Product = require('../models/product')
const User = require('../models/user')
// const Cart = require('../models/cart')
// const CartItem = require('../models/cart-item')
// const Order = require('../models/order')
// const OrderItem = require('../models/order-item')

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    })
  })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: 'Details',
        path: '/products',
      })
    })
    .catch((err) => {
      console.log('__err_fetching_product__', err)
    })
}

exports.getCart = (req, res, next) => {
  const user = req.user
  user.getCart().then((cart) => {
    // cart.items = cart.items.map((item) => item.product)
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      cartItems: cart.items,
      totalPrice: 0,
    })
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  req.user.addToCart(prodId).then(() => {
    res.redirect('/cart')
  })
}

exports.postDeleteFromCart = (req, res, next) => {
  const productId = req.body.productId
  const user = req.user
  user
    .deleteFromCart(productId)
    .then(() => {
      return res.redirect('/cart')
    })
    .catch((err) => {
      console.log('__error_deleting_from_cart__', err)
    })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      totalPrice: 0,
    })
  })
}

exports.postOrder = (req, res, next) => {
  let fetchedProducts
  let fetchedCart
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders')
    })
    .catch((err) => {
      console.log('__error_creating_order__', err)
    })
}

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout',
//   })
// }
