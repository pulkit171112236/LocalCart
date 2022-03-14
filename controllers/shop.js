const Product = require('../models/product')
const Order = require('../models/order')

const ITEMS_PER_PAGE = 2

exports.getIndex = (req, res, next) => {
  const currPage = +req.query.page || 1
  const isLogged = req.session.isLogged
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      return Product.find()
        .skip((currPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then((products) => {
          return res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            isAuthenticated: req.session.isLogged,
            currPage: currPage,
            hasNextPage: ITEMS_PER_PAGE * currPage < numProducts,
            lastPage: Math.ceil(numProducts / ITEMS_PER_PAGE),
          })
        })
    })
}

exports.getProducts = (req, res, next) => {
  const currPage = +req.query.page || 1
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      return Product.find()
        .skip((currPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then((products) => {
          return res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            isAuthenticated: req.session.isLogged,
            currPage: currPage,
            hasNextPage: ITEMS_PER_PAGE * currPage < numProducts,
            lastPage: Math.ceil(numProducts / ITEMS_PER_PAGE),
          })
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
        isAuthenticated: req.session.isLogged,
      })
    })
    .catch((err) => {
      console.log('__err_fetching_product__', err)
    })
}

exports.getCart = (req, res, next) => {
  const user = req.user
  user.getCart().then((cart) => {
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      cartItems: cart.items,
      totalPrice: cart.totalPrice,
      isAuthenticated: req.session.isLogged,
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
  req.user
    .deleteFromCart(productId)
    .then(() => {
      return res.redirect('/cart')
    })
    .catch((err) => {
      console.log('__error_deleting_from_cart__', err)
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id }).then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.session.isLogged,
    })
  })
}

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders')
    })
    .catch((err) => {
      console.log('__error_creating_order__', err)
    })
}

exports.postDeleteOrder = (req, res, next) => {
  const orderId = req.body.orderId
  Order.findByIdAndDelete(orderId)
    .then(() => {
      res.redirect('./orders')
    })
    .catch((err) => {
      console.log('__error_deleting_order__', err)
    })
}
